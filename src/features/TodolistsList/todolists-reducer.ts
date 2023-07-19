import { appActions, RequestStatusType } from "app/app-reducer";
import { taskThanks } from "./tasks-reducer";
import axios from "axios";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.action";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { ResultCode } from "common/enums/common-enums";
import { todolistsAPI, TodolistType } from "features/TodolistsList/todolists-api";
import { ErrorsType, removeTodolistArgsType } from "common/types";
import { createAppAsyncThunk } from "common/utils";

const removeTodolist = createAppAsyncThunk<removeTodolistArgsType, removeTodolistArgsType>(
  "todolists/removeTodolist",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
      dispatch(todolistsActions.setEntityStatus({ id: arg.todolistId, entityStatus: "loading" }));

      const res = await todolistsAPI.deleteTodolist(arg.todolistId);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
        return arg;
      } else {
        handleServerAppError<{}>(res.data, dispatch);
        dispatch(todolistsActions.setEntityStatus({ id: arg.todolistId, entityStatus: "failed" }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      dispatch(todolistsActions.setEntityStatus({ id: arg.todolistId, entityStatus: "failed" }));
      return rejectWithValue(null);
    }
  }
);

const addTodolist = createAppAsyncThunk<any, { title: string }>("todolists/addTodolist", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    dispatch(appActions.setAddTodoListStatus({ todoListStatus: "loading" }));
    const res = await todolistsAPI.createTodolist(arg.title);
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      dispatch(appActions.setAddTodoListStatus({ todoListStatus: "succeeded" }));
      return { todolist: res.data.data.item };
    } else {
      handleServerAppError<{ item: TodolistType }>(res.data, dispatch);
      dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
      dispatch(appActions.setAddTodoListStatus({ todoListStatus: "failed" }));
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

// const fetchTodolists = createAppAsyncThunk<any,{ todolists: TodolistType[] }>("todolist/fetchTodolists",
//   async (arg, thunkAPI)=>{
//   const {dispatch, rejectWithValue,} = thunkAPI
//     try {
//
//       dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
//       const res = await todolistsAPI.getTodolists()
//
//           dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
//
//           return { todolists: res.data }
//
//
//         todoLists.forEach((t) => dispatch(taskThanks.fetchTasks(t.id)));
//
//
//
//
//
//
//     } catch (e) {
//       handleServerNetworkError(e, dispatch);
//       return rejectWithValue(null);
//     }
//   })

export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(todolistsActions.setTodolists({ todolists: res.data }));
        dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
        return res.data;
      })
      .then((todoLists) => {
        todoLists.forEach((t) => dispatch(taskThanks.fetchTasks(t.id)));
      });
  };
};

const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].title = action.payload.title;
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    setEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    },
    setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
      return action.payload.todolists.map((todo) => ({ ...todo, filter: "all", entityStatus: "idle" }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return [];
      });
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { removeTodolist, addTodolist };

export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return async (dispatch) => {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    try {
      const res = await todolistsAPI.updateTodolist(id, title);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(todolistsActions.changeTodolistTitle({ id: id, title: title }));
        dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      } else {
        handleServerAppError<{}>(res.data, dispatch);
      }
    } catch (e) {
      if (axios.isAxiosError<ErrorsType>(e)) {
        const errorMessage = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(errorMessage, dispatch);
      } else {
        const error = (e as Error).message;
        handleServerNetworkError(error, dispatch);
      }
    }
  };
};

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
