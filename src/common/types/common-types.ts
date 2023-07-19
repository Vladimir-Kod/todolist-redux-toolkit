import { UpdateDomainTaskModelType } from "features/TodolistsList/tasks-reducer";

export type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: Array<string>;
  data: D;
};

export type argsUpdateTaskType = {
  taskId: string;
  domainModel: UpdateDomainTaskModelType;
  todolistId: string;
};

export type ErrorsType = {
  field: string;
  message: string;
};

export type removeTaskArgsType = {
  taskId: string;
  todolistId: string;
};

export type removeTodolistArgsType = {
  todolistId: string;
};
