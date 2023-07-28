import { AppRootStateType, AppThunkDispatch } from "app/store";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { ResponseType } from "common/types";
import { appActions } from "app/app-reducer";

export const thunkTryCatch = async (
  thunkAPI: BaseThunkAPI<AppRootStateType, any, AppThunkDispatch, null | ResponseType>,
  logic: Function
) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setRequestStatus({ requestStatus: "loading" }));
  try {
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    // в handleServerNetworkError можно удалить убирание крутилки
    dispatch(appActions.setRequestStatus({ requestStatus: "idle" }));
  }
};
