import { AxiosResponse } from "axios";
import { instance } from "common/api";
import { ResponseType } from "common/types";
import {TodolistType} from "./todolists-api-type";

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },

  createTodolist(title: string) {
    return instance.post<
      ResponseType<{ item: TodolistType }>,
      AxiosResponse<ResponseType<{ item: TodolistType }>>,
      { title: string }
    >("todo-lists", { title });
  },

  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },

  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${id}`, { title });
  },
};




