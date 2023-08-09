import { AppRootStateType } from "app/store";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
export const selectSecurityUrl = (state: AppRootStateType)=> state.auth.securityUrl
