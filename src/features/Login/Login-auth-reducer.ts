import {authAPI, AuthRequestType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {ResultCode} from "../TodolistsList/tasks-reducer";
import {
    setIsInitializedAC,
    setIsInitializedACType,
    setRequestStatusAC,
    setRequestStatusType
} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {clearDataAC, ClearDataType} from "../TodolistsList/todolists-reducer";

const initialState = {
    isLoggedIn: false
}

type InitialStateType = {
    isLoggedIn : boolean
}

export const loginAuthReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.isLoggedIn}
        default:
            return state
    }
}

export const setIsLoggedInAC = (isLoggedIn: boolean) => {
    return {
        type:'login/SET-IS-LOGGED-IN',
        isLoggedIn: isLoggedIn
    } as const
}

export type setUserIdACType = ReturnType<typeof setIsLoggedInAC>
type ActionsType = setUserIdACType | setRequestStatusType | setIsInitializedACType | ClearDataType

export const loginTC = (data:AuthRequestType) =>  async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setRequestStatusAC("loading"))
    try{
        const res =  await authAPI.login(data)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setRequestStatusAC("succeeded"))
        } else {
            handleServerAppError<{}>(res.data, dispatch)
            dispatch(setRequestStatusAC("failed"))
        }
    } catch (e) {
        handleServerNetworkError((e as any).message,dispatch)
        dispatch(setRequestStatusAC("failed"))
    }
}

export const logOutTC = () =>  async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setRequestStatusAC("loading"))
    try{
        const res =  await authAPI.logOut()
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setRequestStatusAC("succeeded"))
            dispatch(clearDataAC())
        } else {
            handleServerAppError<{}>(res.data, dispatch)
            dispatch(setRequestStatusAC("failed"))
        }
    } catch (e) {
        handleServerNetworkError((e as any).message,dispatch)
        dispatch(setRequestStatusAC("failed"))
    }
}

export const authMeTC = () =>  async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setRequestStatusAC("loading"))
    try{
        const res =  await authAPI.authMe()
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setRequestStatusAC("succeeded"))

        } else {
            handleServerAppError<{}>(res.data, dispatch)
            dispatch(setRequestStatusAC("failed"))
        }
    } catch (e) {
        handleServerNetworkError((e as any).message,dispatch)
        dispatch(setRequestStatusAC("failed"))
    } finally {
        dispatch(setIsInitializedAC(true))
    }
}