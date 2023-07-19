import { AxiosResponse } from "axios";
import { ResponseType } from "common/types";
import { instance } from "common/api";

export const authAPI = {
  login(data: AuthRequestType) {
    return instance.post<
      ResponseType<{ userId: number }>,
      AxiosResponse<ResponseType<{ userId: number }>>,
      AuthRequestType
    >("auth/login", data);
  },

  logOut() {
    return instance.delete<ResponseType>(`auth/login`);
  },

  authMe() {
    return instance.get<ResponseType<authMeResponseDataType>>("auth/me");
  },
};

export type authMeResponseDataType = {
  id: number;
  email: string;
  login: string;
};
export type AuthRequestType = {
  email: string;
  password: string;
  rememberMe: boolean;
};
