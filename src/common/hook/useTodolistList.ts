import { useCallback, useEffect } from "react";
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
import { TaskStatuses } from "common/enums/common-enums";
import { useActions } from "common/hook/useActions";

export const useTodolistList = () => {
  const todolists = useAppSelector<Array<TodolistDomainType>>(selectTodolists);
  const tasks = useAppSelector<TasksStateType>(selectTasks);
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);
  const addTodolistStatus = useAppSelector<RequestStatusType>(selectAddTodolistStatus);

  const {
    removeTask: removeTaskThunk,
    addTask: addTaskThunk,
    updateTask,
    removeTodolist: removeTodolistThunk,
    changeTodolistTitle: changeTodolistTitleThunk,
    addTodolist: addTodolistThunk,
    fetchTodolists: fetchTodolistsThunk,
  } = useActions({ ...taskThanks, ...todolistsThunks });

  const { changeTodolistFilter } = useActions(todolistsActions);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolistsThunk();
  }, []);

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    removeTaskThunk({ taskId, todolistId });
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    addTaskThunk({ title, todolistId });
  }, []);

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    updateTask({ taskId, domainModel: { status }, todolistId });
  }, []);

  const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
    updateTask({ taskId, domainModel: { title }, todolistId });
  }, []);

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    changeTodolistFilter({ id: todolistId, filter: value });
  }, []);

  const removeTodolist = useCallback(function (todolistId: string) {
    removeTodolistThunk({ todolistId });
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    changeTodolistTitleThunk({ id, title });
  }, []);

  const addTodolist = useCallback((title: string) => {
    addTodolistThunk({ title });
  }, []);

  return {
    isLoggedIn,
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
