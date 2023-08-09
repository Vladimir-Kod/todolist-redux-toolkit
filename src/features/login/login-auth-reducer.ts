import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.action";
import { createAppAsyncThunk, handleServerNetworkError } from "common/utils";
import { ResultCode } from "common/enums/common-enums";
import { authAPI, AuthRequestType } from "features/login/login-auth-api";
import { securityAPI } from "./security/security-api";
import { securityUrlType } from "../../common/types";

const authMe = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/authMe", async (arg, {
  dispatch,
  rejectWithValue
}) => {
  try {
    const res = await authAPI.authMe();
    if (res.data.resultCode === ResultCode.OK) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue({data: res.data,showGlobalError: false});
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setIsInitialized({ isInitialized: true }));
  }
});

const logOut = createAppAsyncThunk<{ isLoggedIn: boolean, securityUrl: null  }, void>("auth/logOut", async (arg, {
  dispatch,
  rejectWithValue
}) => {
  try {
    const res = await authAPI.logOut();
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(clearTasksAndTodolists());

      return { isLoggedIn: false, securityUrl: null  };
    } else {
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, AuthRequestType>("auth/login", async (arg, {
  dispatch,
  rejectWithValue
}) => {
  try {
    const res = await authAPI.login(arg);
    if (res.data.resultCode === ResultCode.OK) {
      return { isLoggedIn: true };
    } else {
      if (res.data.resultCode === ResultCode.ERROR_CAPTCHA){
        dispatch(getCaptchaUrl())
        return rejectWithValue({ data: res.data, showGlobalError: true });
      }
      // ❗ Если у нас fieldsErrors есть значит мы будем отображать эти ошибки
      // в конкретном поле в компоненте
      // ❗ Если у нас fieldsErrors нету значит отобразим ошибку глобально
      const isShowAppError = !res.data.fieldsErrors.length;
      return rejectWithValue({ data: res.data, showGlobalError: isShowAppError });
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const getCaptchaUrl = createAppAsyncThunk<securityUrlType, void>("auth/getCaptchaUrl", async (arg, {
  dispatch,
  rejectWithValue
}) => {
  try {
    const res = await securityAPI.getCaptchaUrl();
    return { url: res.data.url };
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    securityUrl: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCaptchaUrl.fulfilled, (state, action) => {
        state.securityUrl = action.payload.url;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
        state.securityUrl= action.payload.securityUrl
      })
      .addCase(authMe.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  }
});

export const loginAuthReducer = slice.reducer;
export const authThunk = { login, logOut, authMe, getCaptchaUrl };
