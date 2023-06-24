import {setErrorAC, setErrorType, setRequestStatusAC, setRequestStatusType} from '../app/app-reducer'
import {Dispatch} from 'redux'
import {ResponseType} from '../api/todolists-api'

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
    } else {
        dispatch(setErrorAC('Some error occurred'))
    }
    dispatch(setRequestStatusAC('failed'))
}

export const handleServerNetworkError = (error: string, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setErrorAC(error))
    dispatch(setRequestStatusAC('failed'))
}

type ErrorUtilsDispatchType = Dispatch<setRequestStatusType | setErrorType>
