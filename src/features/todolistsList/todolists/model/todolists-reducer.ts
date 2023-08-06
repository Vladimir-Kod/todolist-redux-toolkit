import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.action";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { ResultCode } from "common/enums/common-enums";
import { todolistsAPI } from "features/todolistsList/todolists/api/todolists-api";
import { changeTodolistTitleArgsType, removeTodolistArgsType } from "common/types";
import {createAppAsyncThunk} from "common/utils";
import {TodolistType} from "../api/todolists-api-type";

const changeTodolistTitle = createAppAsyncThunk<changeTodolistTitleArgsType, changeTodolistTitleArgsType>(
  "todolists/changeTodolistTitle",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      const res = await todolistsAPI.updateTodolist(arg.id, arg.title);
      if (res.data.resultCode === ResultCode.OK) {
        return arg;
      } else {
        return rejectWithValue({data: res.data, showGlobalError: true});
      }
    } catch (e:any) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(e.message);
    }
  }
);

const removeTodolist = createAppAsyncThunk<removeTodolistArgsType, removeTodolistArgsType>(
  "todolists/removeTodolist",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      dispatch(todolistsActions.setEntityStatus({ id: arg.todolistId, entityStatus: "loading" }));

      const res = await todolistsAPI.deleteTodolist(arg.todolistId);
      if (res.data.resultCode === ResultCode.OK) {
        return arg;
      } else {
        dispatch(todolistsActions.setEntityStatus({ id: arg.todolistId, entityStatus: "failed" }));
        return rejectWithValue(null);
      }
    } catch (e: any) {
      handleServerNetworkError(e, dispatch);
      dispatch(todolistsActions.setEntityStatus({ id: arg.todolistId, entityStatus: "failed" }));
      return rejectWithValue(e.message);
    }
  }
);

const addTodolist = createAppAsyncThunk<
    { todolist: TodolistType },
    {
      title: string;
    }
>("todolists/addTodolist", async (arg, { dispatch, rejectWithValue }) => {

  try {
    dispatch(appActions.setAddTodoListStatus({ todoListStatus: "loading" }));
    const res = await todolistsAPI.createTodolist(arg.title);
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(appActions.setAddTodoListStatus({ todoListStatus: "succeeded" }));
      return { todolist: res.data.data.item };
    } else {
      dispatch(appActions.setAddTodoListStatus({ todoListStatus: "failed" }));
      return rejectWithValue({data: res.data,showGlobalError:false});
    }
  } catch (e: any) {
    dispatch(appActions.setAddTodoListStatus({ todoListStatus: "failed" }));
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(e.message);
  }
});

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  "todolist/fetchTodolists",
  async (arg, { dispatch, rejectWithValue }) => {

    try {
      const res = await todolistsAPI.getTodolists();
      return { todolists: res.data };
    } catch (e:any) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(e.message);
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
