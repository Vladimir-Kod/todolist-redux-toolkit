import {
    AddTodolistActionType, ClearDataType,
    RemoveTodolistActionType,
    setEntityStatusAC, SetEntityStatusType,
    SetTodolistsActionType
} from './todolists-reducer'
import {
    taskAPI,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {
    RequestStatusType,
    setErrorType,
    setRequestStatusAC,
    setRequestStatusType
} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios, { AxiosError } from "axios";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [{...action.task, entityTaskStatus:'idle'}, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks.map(t=> ({...t, entityTaskStatus:'idle'}))}
        case 'SET-ENTITY-TASK-STATUS':
            return {...state, [action.todolistId]: [...state[action.todolistId]
                    .map(t=>t.id===action.taskId ? {...t, entityTaskStatus: action.newStatus} : t)]}
        case 'CLEAR-DATA':
            return {}
        default:
            return state
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)

export const setEntityTaskStatus =(todolistId: string, taskId: string, newStatus: RequestStatusType)=>{
    return {
        type: "SET-ENTITY-TASK-STATUS",
        todolistId,
        taskId,
        newStatus
    } as const
}

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setRequestStatusAC("loading"))
    taskAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            const action = setTasksAC(tasks, todolistId)
            dispatch(action)
            dispatch(setRequestStatusAC("succeeded"))
        })
        .catch((e)=>{
            handleServerNetworkError(e.message, dispatch)
        })

}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setRequestStatusAC("loading"))
    dispatch(setEntityTaskStatus(todolistId,taskId,"loading"))
    taskAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === ResultCode.OK) {
                const action = removeTaskAC(taskId, todolistId)
                dispatch(action)
                dispatch(setRequestStatusAC("succeeded"))
            } else {
                handleServerAppError<{}>(res.data, dispatch)
            }


        })
        .catch((e)=>{
            handleServerNetworkError(e.message, dispatch)
            dispatch(setEntityTaskStatus(todolistId,taskId,"failed"))
        })

}

export enum ResultCode {
    OK = 0,
    ERROR,
    ERROR_CAPTCHA = 10
}

export type ErrorsType = {
    field: string
    message: string
}

export const addTaskTC = (title: string, todolistId: string,) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setRequestStatusAC("loading"))
    dispatch(setEntityStatusAC(todolistId, "loading"))
    taskAPI.createTask(todolistId, title)
        .then(res => {
            if(res.data.resultCode === ResultCode.OK){
                const task = res.data.data.item
                const action = addTaskAC(task)
                dispatch(action)
                dispatch(setRequestStatusAC("idle"))
                dispatch(setEntityStatusAC(todolistId, "succeeded"))
            } else {
                handleServerAppError<{ item: TaskType }>(res.data, dispatch)
                dispatch(setEntityStatusAC(todolistId, "failed"))
            }
        })
        .catch((e: AxiosError<ErrorsType>)=>{
            const errorMessage = e.response ? e.response.data.message : e.message
            handleServerNetworkError(errorMessage, dispatch)
            dispatch(setEntityStatusAC(todolistId, "failed"))
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
        async (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {

        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        dispatch(setRequestStatusAC("loading"))
        dispatch(setEntityTaskStatus(todolistId,taskId,"loading"))

        try{
            const res = await taskAPI.updateTask(todolistId, taskId, apiModel)
            if(res.data.resultCode === ResultCode.OK){
                const action = updateTaskAC(taskId, domainModel, todolistId)
                dispatch(action)
                dispatch(setRequestStatusAC("succeeded"))
                dispatch(setEntityTaskStatus(todolistId,taskId,"succeeded"))
            } else {
                handleServerAppError<{ item: TaskType }>(res.data, dispatch)
            }
        } catch (e){
                if (axios.isAxiosError<ErrorsType>(e)){
                    const errorMessage = e.response ? e.response.data.message : e.message
                    handleServerNetworkError(errorMessage, dispatch)
                } else {
                    const error = (e as Error).message
                }
            }
    }


// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

type ActionsType =
    | ClearDataType
    | SetEntityStatusType
    | setEntityTaskStatusType
    | setErrorType
    | setRequestStatusType
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>

export type setEntityTaskStatusType = ReturnType<typeof setEntityTaskStatus>

export type TasksStateType = {
    [key: string]: Array<TaskTypeWithEntityTaskStatusType>
}

export type TaskTypeWithEntityTaskStatusType = TaskType & { entityTaskStatus: RequestStatusType }