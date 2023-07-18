import {
  AddTaskArgType,
  argsUpdateTaskType,
  ResultCode,
  taskAPI,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  UpdateTaskModelType,
} from "api/todolists-api";
import { AppThunk } from "app/store";
import { appActions, RequestStatusType } from "app/app-reducer";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.action";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { handleServerNetworkError } from "utils/handle-server-network-error";
import { handleServerAppError } from "utils/handle-server-app-error";

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    try {
      const res = await taskAPI.getTasks(todolistId);
      dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      const tasks = res.data.items;
      return { tasks, todolistId };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>("tasks/addTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
  dispatch(todolistsActions.setEntityStatus({ id: arg.todolistId, entityStatus: "loading" }));
  try {
    const res = await taskAPI.createTask(arg);
    if (res.data.resultCode === ResultCode.OK) {
      const task = res.data.data.item;
      dispatch(appActions.setRequestStatus({ requestStatus: "idle" }));
      dispatch(todolistsActions.setEntityStatus({ id: arg.todolistId, entityStatus: "succeeded" }));
      return { task };
    } else {
      handleServerAppError<{ item: TaskType }>(res.data, dispatch);
      dispatch(todolistsActions.setEntityStatus({ id: arg.todolistId, entityStatus: "failed" }));
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const updateTask = createAppAsyncThunk<argsUpdateTaskType, argsUpdateTaskType>(
  "tasks/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    try {
      dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
      dispatch(
        tasksActions.setEntityTaskStatus({ todolistId: arg.todolistId, taskId: arg.taskId, newStatus: "loading" })
      );

      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);

      if (!task) {
        dispatch(appActions.setError({ error: "Task not found in the state" }));
        return rejectWithValue(null);
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel,
      };

      const res = await taskAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
        dispatch(
          tasksActions.setEntityTaskStatus({ todolistId: arg.todolistId, taskId: arg.taskId, newStatus: "succeeded" })
        );
        return arg;
      } else {
        handleServerAppError<{ item: TaskType }>(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const taskForCurrentTodolist = state[action.payload.todolistId];
      const index = taskForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) state[action.payload.todolistId].splice(index, 1);
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
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.domainModel };
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const taskForCurrentTodolist = state[action.payload.task.todoListId] as TaskType[];
        taskForCurrentTodolist.unshift(action.payload.task);
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((t) => ({ ...t, entityTaskStatus: "idle" }));
      })
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => (state[tl.id] = []));
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return {};
      });
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const taskThanks = { fetchTasks, addTask, updateTask };

// thunks
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

// export const ResultCode = {
//   OK: 0,
//   ERROR: 1,
//   ERROR_CAPTCHA: 10,
// } as const;
//
// export type ErrorsType = {
//   field: string;
//   message: string;
// };

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
