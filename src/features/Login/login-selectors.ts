import { AppRootStateType } from "app/store";

export const selectIsLoggedIN = (state: AppRootStateType) => state.auth.isLoggedIn;
