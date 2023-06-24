import { authAPI, AuthRequestType } from "api/todolists-api";
import { ResultCode } from "../TodolistsList/tasks-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import { clearDataAC } from "../TodolistsList/todolists-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app-reducer";

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
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    try {
      const res = await authAPI.login(data);
      if (res.data.resultCode === ResultCode.OK) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      } else {
        handleServerAppError<{}>(res.data, dispatch);
        dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
      }
    } catch (e) {
      handleServerNetworkError((e as any).message, dispatch);
      dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
    }
  };

export const logOutTC = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
  try {
    const res = await authAPI.logOut();
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
      dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      dispatch(clearDataAC());
    } else {
      handleServerAppError<{}>(res.data, dispatch);
      dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
    }
  } catch (e) {
    handleServerNetworkError((e as any).message, dispatch);
    dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
  }
};

export const authMeTC = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
  try {
    const res = await authAPI.authMe();
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
    } else {
      handleServerAppError<{}>(res.data, dispatch);
      dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
    }
  } catch (e) {
    handleServerNetworkError((e as any).message, dispatch);
    dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
  } finally {
    dispatch(appActions.setIsInitialized({ isInitialized: true }));
  }
};
