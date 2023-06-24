import { authAPI, AuthRequestType } from "api/todolists-api";
import { ResultCode } from "../TodolistsList/tasks-reducer";
import { setIsInitializedAC, setRequestStatusAC } from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import { clearDataAC } from "../TodolistsList/todolists-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const loginAuthReducer = slice.reducer;
export const authActions = slice.actions;

export const loginTC =
  (data: AuthRequestType): AppThunk =>
  async (dispatch) => {
    dispatch(setRequestStatusAC("loading"));
    try {
      const res = await authAPI.login(data);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        dispatch(setRequestStatusAC("succeeded"));
      } else {
        handleServerAppError<{}>(res.data, dispatch);
        dispatch(setRequestStatusAC("failed"));
      }
    } catch (e) {
      handleServerNetworkError((e as any).message, dispatch);
      dispatch(setRequestStatusAC("failed"));
    }
  };

export const logOutTC = (): AppThunk => async (dispatch) => {
  dispatch(setRequestStatusAC("loading"));
  try {
    const res = await authAPI.logOut();
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
      dispatch(setRequestStatusAC("succeeded"));
      dispatch(clearDataAC());
    } else {
      handleServerAppError<{}>(res.data, dispatch);
      dispatch(setRequestStatusAC("failed"));
    }
  } catch (e) {
    handleServerNetworkError((e as any).message, dispatch);
    dispatch(setRequestStatusAC("failed"));
  }
};

export const authMeTC = (): AppThunk => async (dispatch) => {
  dispatch(setRequestStatusAC("loading"));
  try {
    const res = await authAPI.authMe();
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      dispatch(setRequestStatusAC("succeeded"));
    } else {
      handleServerAppError<{}>(res.data, dispatch);
      dispatch(setRequestStatusAC("failed"));
    }
  } catch (e) {
    handleServerNetworkError((e as any).message, dispatch);
    dispatch(setRequestStatusAC("failed"));
  } finally {
    dispatch(setIsInitializedAC(true));
  }
};
