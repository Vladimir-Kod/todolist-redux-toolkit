import { authAPI, AuthRequestType, ResultCode } from "api/todolists-api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.action";
import { handleServerAppError } from "utils/handle-server-app-error";
import { handleServerNetworkError } from "utils/handle-server-network-error";

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
      dispatch(clearTasksAndTodolists());
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
