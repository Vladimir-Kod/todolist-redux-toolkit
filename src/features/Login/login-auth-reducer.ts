import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.action";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { ResultCode } from "common/enums/common-enums";
import { authAPI, AuthRequestType } from "features/Login/login-auth-api";

const authMe = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/authMe", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.authMe();
    if (res.data.resultCode === ResultCode.OK) {
      return { isLoggedIn: true };
    } else {
      handleServerAppError<{}>(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setIsInitialized({ isInitialized: true }));
  }
});

const logOut = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/logOut", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    const res = await authAPI.logOut();
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      dispatch(clearTasksAndTodolists());
      return { isLoggedIn: false };
    } else {
      handleServerAppError<{}>(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, AuthRequestType>("auth/login", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    const res = await authAPI.login(arg);
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError<{}>(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(authMe.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

export const loginAuthReducer = slice.reducer;
export const authThunk = { login, logOut, authMe };
