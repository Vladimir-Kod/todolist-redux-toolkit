import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  isInitialized: false,
  status: "idle" as RequestStatusType,
  error: null as null | string,
  addTodoListStatus: "idle" as RequestStatusType,
};

export type AppInitialStateType = typeof initialState;

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setRequestStatus: (state, action: PayloadAction<{ requestStatus: RequestStatusType }>) => {
      state.status = action.payload.requestStatus;
    },
    setError: (state, action: PayloadAction<{ error: null | string }>) => {
      state.error = action.payload.error;
    },
    setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
    setAddTodoListStatus: (state, action: PayloadAction<{ todoListStatus: RequestStatusType }>) => {
      state.addTodoListStatus = action.payload.todoListStatus;
    },
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
