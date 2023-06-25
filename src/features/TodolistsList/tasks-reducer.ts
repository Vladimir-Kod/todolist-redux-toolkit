import { taskAPI, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType } from "api/todolists-api";
import { AppRootStateType, AppThunk } from "app/store";
import { appActions, RequestStatusType } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import axios, { AxiosError } from "axios";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const taskForCurrentTodolist = state[action.payload.todolistId];
      const index = taskForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) state[action.payload.todolistId].splice(index, 1);
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const taskForCurrentTodolist = state[action.payload.task.todoListId] as TaskType[];
      taskForCurrentTodolist.unshift(action.payload.task);
    },
    updateTask: (
      state,
      action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>
    ) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model };
    },
    setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>) => {
      state[action.payload.todolistId] = action.payload.tasks.map((t) => ({ ...t, entityTaskStatus: "idle" }));
    },
    setEntityTaskStatus: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; newStatus: RequestStatusType }>
    ) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) tasks[index] = { ...tasks[index], entityTaskStatus: action.payload.newStatus };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => (state[tl.id] = []));
      });
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;

// thunks
export const fetchTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    taskAPI
      .getTasks(todolistId)
      .then((res) => {
        const tasks = res.data.items;
        const action = tasksActions.setTasks({ tasks, todolistId });
        dispatch(action);
        dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      })
      .catch((e) => {
        handleServerNetworkError(e.message, dispatch);
      });
  };
export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    dispatch(tasksActions.setEntityTaskStatus({ todolistId, taskId, newStatus: "loading" }));
    taskAPI
      .deleteTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === ResultCode.OK) {
          const action = tasksActions.removeTask({ taskId, todolistId });
          dispatch(action);
          dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
        } else {
          handleServerAppError<{}>(res.data, dispatch);
        }
      })
      .catch((e) => {
        handleServerNetworkError(e.message, dispatch);
        dispatch(tasksActions.setEntityTaskStatus({ todolistId, taskId, newStatus: "failed" }));
      });
  };

export enum ResultCode {
  OK = 0,
  ERROR,
  ERROR_CAPTCHA = 10,
}

export type ErrorsType = {
  field: string;
  message: string;
};

export const addTaskTC =
  (title: string, todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    dispatch(todolistsActions.setEntityStatus({ id: todolistId, entityStatus: "loading" }));
    taskAPI
      .createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === ResultCode.OK) {
          const task = res.data.data.item;
          const action = tasksActions.addTask({ task });
          dispatch(action);
          dispatch(appActions.setRequestStatus({ requestStatus: "idle" }));
          dispatch(todolistsActions.setEntityStatus({ id: todolistId, entityStatus: "succeeded" }));
        } else {
          handleServerAppError<{ item: TaskType }>(res.data, dispatch);
          dispatch(todolistsActions.setEntityStatus({ id: todolistId, entityStatus: "failed" }));
        }
      })
      .catch((e: AxiosError<ErrorsType>) => {
        const errorMessage = e.response ? e.response.data.message : e.message;
        handleServerNetworkError(errorMessage, dispatch);
        dispatch(todolistsActions.setEntityStatus({ id: todolistId, entityStatus: "failed" }));
      });
  };
export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
  async (dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state");
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    dispatch(tasksActions.setEntityTaskStatus({ todolistId, taskId, newStatus: "loading" }));

    try {
      const res = await taskAPI.updateTask(todolistId, taskId, apiModel);
      if (res.data.resultCode === ResultCode.OK) {
        const action = tasksActions.updateTask({ taskId, model: domainModel, todolistId });
        dispatch(action);
        dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
        dispatch(tasksActions.setEntityTaskStatus({ todolistId, taskId, newStatus: "succeeded" }));
      } else {
        handleServerAppError<{ item: TaskType }>(res.data, dispatch);
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

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

export type TasksStateType = {
  [key: string]: Array<TaskTypeWithEntityTaskStatusType>;
};

export type TaskTypeWithEntityTaskStatusType = TaskType & { entityTaskStatus: RequestStatusType };
