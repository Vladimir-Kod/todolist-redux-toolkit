import { useCallback } from "react";
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistsList/todolists-reducer";
import { TasksStateType, taskThanks } from "features/TodolistsList/tasks-reducer";
import { RequestStatusType } from "app/app-reducer";
import { selectTasks, selectTodolists } from "features/TodolistsList/useTodolistList-selectors";
import { selectIsLoggedIn } from "features/Login/login-auth-selectors";
import { selectAddTodolistStatus } from "app/app-selectors";
import { useAppSelector } from "common/hook/useAppSelector";
import { useAppDispatch } from "common/hook/useAppDispatch";
import { TaskStatuses } from "common/enums/common-enums";

export const useTodolistList = () => {
  const todolists = useAppSelector<Array<TodolistDomainType>>(selectTodolists);
  const tasks = useAppSelector<TasksStateType>(selectTasks);
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);
  const addTodolistStatus = useAppSelector<RequestStatusType>(selectAddTodolistStatus);
  const dispatch = useAppDispatch();

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    const thunk = taskThanks.removeTask({ taskId, todolistId });
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

  const removeTodolist = useCallback(function (todolistId: string) {
    dispatch(todolistsThunks.removeTodolist({ todolistId }));
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(todolistsThunks.changeTodolistTitle({ id, title }));
  }, []);

  const addTodolist = useCallback((title: string) => {
    dispatch(todolistsThunks.addTodolist({ title }));
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
