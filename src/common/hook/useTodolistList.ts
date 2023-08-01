import { useEffect } from "react";
import {
  TodolistDomainType,
  todolistsThunks,
} from "features/todolistsList/todolists/model/todolists-reducer";
import { TasksStateType, taskThanks } from "features/todolistsList/tasks/model/tasks-reducer";
import { RequestStatusType } from "app/app-reducer";
import { selectTasks, selectTodolists } from "features/todolistsList/model/useTodolistList-selectors";
import { selectIsLoggedIn } from "features/Login/login-auth-selectors";
import { selectAddTodolistStatus } from "app/app-selectors";
import { useAppSelector } from "common/hook/useAppSelector";
import { useActions } from "common/hook/useActions";

export const useTodolistList = () => {
  const todolists = useAppSelector<Array<TodolistDomainType>>(selectTodolists);
  const tasks = useAppSelector<TasksStateType>(selectTasks);
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);
  const addTodolistStatus = useAppSelector<RequestStatusType>(selectAddTodolistStatus);

  const {
    addTodolist,
    fetchTodolists
  } = useActions({ ...taskThanks, ...todolistsThunks });

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists({});
  }, []);

  const addTodolistCallBack = (title: string) => {
    addTodolist({ title });
  }

  return {
    isLoggedIn,
    addTodolistStatus,
    tasks,
    todolists,
    addTodolistCallBack,
  };
};
