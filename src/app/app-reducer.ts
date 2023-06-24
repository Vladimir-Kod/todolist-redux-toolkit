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

// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case "APP/SET-STATUS":
//       return { ...state, status: action.status };
//     case "APP/SET-ERROR":
//       return { ...state, error: action.error };
//     case "APP/SET-IS-INITIALIZED":
//       return { ...state, isInitialized: action.isInitialized };
//     case "SET-ADD-TODOLIST-STATUS":
//       return { ...state, addTodoListStatus: action.status };
//     default:
//       return state;
//   }
// };

// export const setRequestStatusAC = (status: RequestStatusType) => {
//   return {
//     type: "APP/SET-STATUS",
//     status,
//   } as const;
// };
// export const setErrorAC = (error: null | string) => {
//   return {
//     type: "APP/SET-ERROR",
//     error,
//   } as const;
// };

// export const setIsInitializedAC = (isInitialized: boolean) => {
//   return {
//     type: "APP/SET-IS-INITIALIZED",
//     isInitialized,
//   } as const;
// };

// export const setAddTodoListStatusAC = (status: RequestStatusType) =>
//   ({
//     type: "SET-ADD-TODOLIST-STATUS",
//     status,
//   } as const);

// export type setIsInitializedACType = ReturnType<typeof setIsInitializedAC>;
// export type setRequestStatusType = ReturnType<typeof setRequestStatusAC>;
// export type setErrorType = ReturnType<typeof setErrorAC>;
// export type SetAddTodolistStatusType = ReturnType<typeof setAddTodoListStatusAC>;
//
// type ActionsType = setRequestStatusType | setErrorType | setIsInitializedACType | SetAddTodolistStatusType;
