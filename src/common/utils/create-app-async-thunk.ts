import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppRootStateType, AppThunkDispatch } from "app/store";
import { ResponseType } from "common/types";

export const  createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppThunkDispatch
  rejectValue: null | RejectValueType | string
}>()

export type RejectValueType = {
  data: ResponseType
  showGlobalError: boolean
}
