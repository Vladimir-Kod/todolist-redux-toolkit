import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "app/store";
import {
  addTodolistTC,
  changeTodolistTitleTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
  todolistsActions,
} from "../todolists-reducer";
import { removeTaskTC, TasksStateType, taskThanks } from "../tasks-reducer";
import { RequestStatusType } from "app/app-reducer";
import { TaskStatuses } from "api/todolists-api";
import { selectTasks, selectTodolists } from "features/TodolistsList/hook/useTodolistList-selectors";
import { selectIsLoggedIn } from "features/Login/login-selectors";
import { selectAddTodolistStatus } from "app/app-selectors";

const useTodolistList = () => {
  const todolists = useAppSelector<Array<TodolistDomainType>>(selectTodolists);
  const tasks = useAppSelector<TasksStateType>(selectTasks);
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);
  const addTodolistStatus = useAppSelector<RequestStatusType>(selectAddTodolistStatus);
  const dispatch = useAppDispatch();

  const removeTask = useCallback(function (id: string, todolistId: string) {
    const thunk = removeTaskTC(id, todolistId);
    dispatch(thunk);
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(taskThanks.addTask({ title, todolistId }));
  }, []);

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    dispatch(taskThanks.updateTask({ taskId, domainModel: { status }, todolistId }));
  }, []);

  const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
    dispatch(taskThanks.updateTask({ taskId, domainModel: { title }, todolistId }));
  }, []);

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    const action = todolistsActions.changeTodolistFilter({ id: todolistId, filter: value });
    dispatch(action);
  }, []);

  const removeTodolist = useCallback(function (id: string) {
    const thunk = removeTodolistTC(id);
    dispatch(thunk);
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    const thunk = changeTodolistTitleTC(id, title);
    dispatch(thunk);
  }, []);

  const addTodolist = useCallback((title: string) => {
    const thunk = addTodolistTC(title);
    dispatch(thunk);
  }, []);

  return {
    isLoggedIn,
    dispatch,
    addTodolistStatus,
    tasks,
    todolists,
    removeTask,
    addTask,
    changeStatus,
    changeTaskTitle,
    changeFilter,
    removeTodolist,
    changeTodolistTitle,
    addTodolist,
  };
};

export default useTodolistList;
