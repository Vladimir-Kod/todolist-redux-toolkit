import { AppRootStateType } from "app/store";

export const selectStatus = (state: AppRootStateType) => state.app.status;
export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized;
export const selectAddTodolistStatus = (state: AppRootStateType) => state.app.addTodoListStatus;
export const selectError = (state: AppRootStateType) => state.app.error;
