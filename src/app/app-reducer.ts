import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AnyAction} from "redux";

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
    extraReducers: (builder) => {
        builder
            .addMatcher((actions: AnyAction) => {
                return actions.type.endsWith("/pending")
            }, (state) => {
                state.status = "loading"
            })
            .addMatcher((actions: AnyAction) => {
                return actions.type.endsWith("/fulfilled")
            }, (state) => {
                state.status = "succeeded"
            })
            .addMatcher((actions: AnyAction) => {
                return actions.type.endsWith("/rejected")
            }, (state, action) => {
                state.status = 'failed'
                if (action.type.includes("addTodolist")) return

                const {payload, error} = action
                if (payload) {
                    if (payload.showGlobalError) {
                        state.error = payload.data.messages.length ? payload.data.messages[0] : 'Some error occurred'
                    }
                } else {
                    state.error = error.message ? error.message : 'Some error occurred'
                }
            })
    }
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
