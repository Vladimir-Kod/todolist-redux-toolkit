import { todolistsAPI, TodolistType } from "api/todolists-api";
import { appActions, RequestStatusType } from "app/app-reducer";
import { ErrorsType, fetchTasksTC, ResultCode } from "./tasks-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import axios from "axios";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "todolist",
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state.splice(index, 1);
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    },
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
    clearData: () => {},
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

// thunks
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
        todoLists.forEach((t) => dispatch(fetchTasksTC(t.id)));
      });
  };
};
export const removeTodolistTC = (todolistId: string): AppThunk => {
  return async (dispatch) => {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    dispatch(todolistsActions.setEntityStatus({ id: todolistId, entityStatus: "loading" }));
    try {
      const res = await todolistsAPI.deleteTodolist(todolistId);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(todolistsActions.removeTodolist({ id: todolistId }));
        dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      } else {
        handleServerAppError<{}>(res.data, dispatch);
        dispatch(todolistsActions.setEntityStatus({ id: todolistId, entityStatus: "failed" }));
      }
    } catch (e) {
      if (axios.isAxiosError<ErrorsType>(e)) {
        const errorMessage = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(errorMessage, dispatch);
      } else {
        const error = (e as Error).message;
      }
      dispatch(todolistsActions.setEntityStatus({ id: todolistId, entityStatus: "failed" }));
    }
  };
};
export const addTodolistTC = (title: string): AppThunk => {
  return async (dispatch) => {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    dispatch(appActions.setAddTodoListStatus({ todoListStatus: "loading" }));
    try {
      const res = await todolistsAPI.createTodolist(title);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }));
        dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
        dispatch(appActions.setAddTodoListStatus({ todoListStatus: "succeeded" }));
      } else {
        handleServerAppError<{ item: TodolistType }>(res.data, dispatch);
        dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
        dispatch(appActions.setAddTodoListStatus({ todoListStatus: "failed" }));
      }
    } catch (e) {
      if (axios.isAxiosError<ErrorsType>(e)) {
        const errorMessage = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(errorMessage, dispatch);
      } else {
        const error = (e as Error).message;
      }
      dispatch(appActions.setAddTodoListStatus({ todoListStatus: "failed" }));
    }
  };
};
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
      }
    }
  };
};

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
