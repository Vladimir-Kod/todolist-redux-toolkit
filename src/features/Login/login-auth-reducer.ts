import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.action";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { ResultCode } from "common/enums/common-enums";
import { authAPI, AuthRequestType } from "features/Login/login-auth-api";
import { AppThunk } from "app/store";

// export const loginTC =
//   (data: AuthRequ estType): AppThunk =>
//   async (dispatch) => {
//     dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
//     try {
//       const res = await authAPI.login(data);
//       if (res.data.resultCode === ResultCode.OK) {
//         dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
//         dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
//       } else {
//         handleServerAppError<{}>(res.data, dispatch);
//         dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
//       }
//     } catch (e) {
//       handleServerNetworkError((e as any).message, dispatch);
//       dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
//     }
//   };

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

// const authMe = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/authMe", async (arg, thunkAPI) => {
//   const { dispatch, rejectWithValue } = thunkAPI;
//   try {
//     dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
//     const res = await authAPI.authMe();
//     if (res.data.resultCode === ResultCode.OK) {
//       dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
//       return { isLoggedIn: true };
//     } else {
//       handleServerAppError<{}>(res.data, dispatch);
//       // dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
//       return rejectWithValue(null);
//     }
//   } catch (e) {
//     handleServerNetworkError(e, dispatch);
//     return rejectWithValue(null);
//   }
// });
//
// const logOut = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/logOut", async (arg, thunkAPI) => {
//   const { dispatch, rejectWithValue } = thunkAPI;
//   try {
//     dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
//     const res = await authAPI.logOut();
//     if (res.data.resultCode === ResultCode.OK) {
//       dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
//       dispatch(clearTasksAndTodolists());
//       return { isLoggedIn: false };
//     } else {
//       handleServerAppError<{}>(res.data, dispatch);
//       // dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
//       return rejectWithValue(null);
//     }
//   } catch (e) {
//     handleServerNetworkError(e, dispatch);
//     return rejectWithValue(null);
//   }
// });

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, AuthRequestType>("auth/login", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
    const res = await authAPI.login(arg);
    if (res.data.resultCode === ResultCode.OK) {
      dispatch(appActions.setRequestStatus({ requestStatus: "succeeded" }));
      // dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError<{}>(res.data, dispatch);
      // dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
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
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    // .addCase(logOut.fulfilled, (state, action) => {
    //   state.isLoggedIn = action.payload.isLoggedIn;
    // })
    // .addCase(authMe.fulfilled, (state, action) => {
    //   state.isLoggedIn = action.payload.isLoggedIn;
    // });
  },
});

export const loginAuthReducer = slice.reducer;

export const authActions = slice.actions;
export const authThunk = { login };
