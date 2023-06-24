import { todolistsAPI, TodolistType } from "../../api/todolists-api";
import { Dispatch } from "redux";
import {
  RequestStatusType,
  setAddTodoListStatusAC,
  SetAddTodolistStatusType,
  setErrorType,
  setRequestStatusAC,
  setRequestStatusType,
} from "../../app/app-reducer";
import { ErrorsType, fetchTasksTC, ResultCode } from "./tasks-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import axios from "axios";
import { AppThunkDispatch } from "../../app/store";

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsType
): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.id);
    case "ADD-TODOLIST":
      return [{ ...action.todolist, filter: "all", entityStatus: "idle" }, ...state];
    case "CHANGE-TODOLIST-TITLE":
      return state.map((tl) => (tl.id === action.id ? { ...tl, title: action.title } : tl));
    case "CHANGE-TODOLIST-FILTER":
      return state.map((tl) => (tl.id === action.id ? { ...tl, filter: action.filter } : tl));
    case "SET-TODOLISTS":
      return action.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
    case "SET-ENTITY-STATUS":
      return state.map((tl) => (tl.id === action.todolisId ? { ...tl, entityStatus: action.status } : tl));
    case "CLEAR-DATA":
      return [];
    default:
      return state;
  }
};

// actions
export const removeTodolistAC = (id: string) => ({ type: "REMOVE-TODOLIST", id } as const);
export const addTodolistAC = (todolist: TodolistType) => ({ type: "ADD-TODOLIST", todolist } as const);
export const clearDataAC = () => ({ type: "CLEAR-DATA" } as const);
export const changeTodolistTitleAC = (id: string, title: string) =>
  ({
    type: "CHANGE-TODOLIST-TITLE",
    id,
    title,
  } as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
  ({
    type: "CHANGE-TODOLIST-FILTER",
    id,
    filter,
  } as const);
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({ type: "SET-TODOLISTS", todolists } as const);
export const setEntityStatusAC = (todolisId: string, status: RequestStatusType) =>
  ({
    type: "SET-ENTITY-STATUS",
    todolisId,
    status,
  } as const);

// thunks
export const fetchTodolistsTC = () => {
  return (dispatch: AppThunkDispatch) => {
    dispatch(setRequestStatusAC("loading"));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC(res.data));
        dispatch(setRequestStatusAC("succeeded"));
        return res.data;
      })
      .then((todoLists) => {
        todoLists.forEach((t) => dispatch(fetchTasksTC(t.id)));
      });
  };
};
export const removeTodolistTC = (todolistId: string) => {
  return async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setRequestStatusAC("loading"));
    dispatch(setEntityStatusAC(todolistId, "loading"));
    try {
      const res = await todolistsAPI.deleteTodolist(todolistId);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(removeTodolistAC(todolistId));
        dispatch(setRequestStatusAC("succeeded"));
      } else {
        handleServerAppError<{}>(res.data, dispatch);
        dispatch(setEntityStatusAC(todolistId, "failed"));
      }
    } catch (e) {
      if (axios.isAxiosError<ErrorsType>(e)) {
        const errorMessage = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(errorMessage, dispatch);
      } else {
        const error = (e as Error).message;
      }
      dispatch(setEntityStatusAC(todolistId, "failed"));
    }
  };
};
export const addTodolistTC = (title: string) => {
  return async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setRequestStatusAC("loading"));
    dispatch(setAddTodoListStatusAC("loading"));
    try {
      const res = await todolistsAPI.createTodolist(title);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(addTodolistAC(res.data.data.item));
        dispatch(setRequestStatusAC("succeeded"));
        dispatch(setAddTodoListStatusAC("succeeded"));
      } else {
        handleServerAppError<{ item: TodolistType }>(res.data, dispatch);
        dispatch(setRequestStatusAC("failed"));
        dispatch(setAddTodoListStatusAC("failed"));
      }
    } catch (e) {
      if (axios.isAxiosError<ErrorsType>(e)) {
        const errorMessage = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(errorMessage, dispatch);
      } else {
        const error = (e as Error).message;
      }
      dispatch(setAddTodoListStatusAC("failed"));
    }
  };
};
export const changeTodolistTitleTC = (id: string, title: string) => {
  return async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setRequestStatusAC("loading"));
    try {
      const res = await todolistsAPI.updateTodolist(id, title);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(changeTodolistTitleAC(id, title));
        dispatch(setRequestStatusAC("succeeded"));
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

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type SetEntityStatusType = ReturnType<typeof setEntityStatusAC>;
export type ClearDataType = ReturnType<typeof clearDataAC>;

type ActionsType =
  | SetAddTodolistStatusType
  | ClearDataType
  | setErrorType
  | SetEntityStatusType
  | setRequestStatusType
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsActionType;
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
