import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.action";
import { createAppAsyncThunk, handleServerNetworkError } from "common/utils";
import { ResultCode } from "common/enums/common-enums";
import { authAPI, AuthRequestType } from "features/Login/login-auth-api";

const authMe = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/authMe", async (arg, { dispatch, rejectWithValue }) => {
  try {
    const res = await authAPI.authMe();
    if (res.data.resultCode === ResultCode.OK) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setIsInitialized({ isInitialized: true }));
  }
});

const logOut = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/logOut", async (arg, { dispatch, rejectWithValue }) => {
  try {
    const res = await authAPI.logOut();
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(clearTasksAndTodolists());
      return { isLoggedIn: false };
    } else {
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, AuthRequestType>("auth/login", async (arg, { dispatch, rejectWithValue }) => {
  try {
    const res = await authAPI.login(arg);
    if (res.data.resultCode === ResultCode.OK) {
      return { isLoggedIn: true };
    } else {
      // ❗ Если у нас fieldsErrors есть значит мы будем отображать эти ошибки
      // в конкретном поле в компоненте
      // ❗ Если у нас fieldsErrors нету значит отобразим ошибку глобально
      const isShowAppError = !res.data.fieldsErrors.length;
      return rejectWithValue({data: res.data, showGlobalError: isShowAppError});
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
