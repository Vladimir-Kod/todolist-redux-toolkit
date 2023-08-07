import React, {useEffect} from "react";
import "./App.css";
import LinearProgress from "@mui/material/LinearProgress";
import {authThunk} from "features/login/login-auth-reducer";
import CircularProgress from "@mui/material/CircularProgress";
import {selectIsInitialized} from "app/app-selectors";
import {useActions, useAppSelector} from "common/hook";
import {ErrorSnackbar} from "common/components";
import {Header} from "./header/header";
import {Routing} from "./routing/routing";

function App() {

    const isInitialized = useAppSelector<boolean>(selectIsInitialized);
    const {authMe} = useActions(authThunk);

    useEffect(() => {
        authMe({});
    }, []);

    if (!isInitialized) {
        return (
            <div className="AppCircularProgress">
                <CircularProgress size={200}/>
            </div>
        );
    }

    return (
        <div className="App">

            <Header/>
            {status === "loading" && <LinearProgress/>}
            <Routing/>
            <ErrorSnackbar/>

        </div>
    );
}
export default App;
