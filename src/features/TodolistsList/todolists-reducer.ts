import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.action";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { ResultCode } from "common/enums/common-enums";
import { todolistsAPI, TodolistType } from "features/TodolistsList/todolists-api";
import { changeTodolistTitleArgsType, removeTodolistArgsType } from "common/types";
import { createAppAsyncThunk } from "common/utils";
import { thunkTryCatch } from "common/utils/thunk-try-catch";

const changeTodolistTitle = createAppAsyncThunk<changeTodolistTitleArgsType, changeTodolistTitleArgsType>(
  "todolists/changeTodolistTitle",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
      const res = await todolistsAPI.updateTodolist(arg.id, arg.title);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
        return arg;
      } else {
        handleServerAppError<{}>(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

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

const addTodolist = createAppAsyncThunk<
  { todolist: TodolistType },
  {
    title: string;
  }
>("todolists/addTodolist", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  return thunkTryCatch(thunkAPI, async () => {
    dispatch(appActions.setAddTodoListStatus({ todoListStatus: "loading" }));
    const res = await todolistsAPI.createTodolist(arg.title);
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(appActions.setAddTodoListStatus({ todoListStatus: "succeeded" }));
      return { todolist: res.data.data.item };
    } else {
      handleServerAppError<{ item: TodolistType }>(res.data, dispatch);

      dispatch(appActions.setAddTodoListStatus({ todoListStatus: "failed" }));
      return rejectWithValue(null);
    }
  });
});

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  "todolist/fetchTodolists",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    try {
      dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
      const res = await todolistsAPI.getTodolists();

      dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      return { todolists: res.data };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    setEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((todo) => ({ ...todo, filter: "all", entityStatus: "idle" }));
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) state[index].title = action.payload.title;
      })
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
export const todolistsThunks = { removeTodolist, addTodolist, changeTodolistTitle, fetchTodolists };

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
