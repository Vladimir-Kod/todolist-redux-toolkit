import React, { useEffect } from "react";
import "./App.css";
import { TodolistsList } from "features/TodolistsList/TodolistsList";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { useSelector } from "react-redux";
import { AppRootStateType, useAppDispatch, useAppSelector } from "./store";
import { RequestStatusType } from "./app-reducer";
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar";
import { Login } from "features/Login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { authMeTC, logOutTC } from "features/Login/Login-auth-reducer";
import CircularProgress from "@mui/material/CircularProgress";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";

function App() {
  const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status);
  const isInitialized = useAppSelector<boolean>((state) => state.app.isInitialized);
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  const logOut = () => {
    dispatch(logOutTC());
  };

  useEffect(() => {
    dispatch(authMeTC());
  }, []);

  if (!isInitialized) {
    return (
      <div className="AppCircularProgress">
        <CircularProgress size={200} />
      </div>
    );
  }

  return (
    <div className="App">
      <AppBar color={"inherit"} position="static" sx={{ paddingRight: "30px" }}>
        <Toolbar className="AppToolbar">
          <Typography variant="h6" color={"black"}>
            <p className="AppTypographyP">MY TODOLIST</p>
          </Typography>

          {isLoggedIn && (
            <Button color="inherit" onClick={logOut}>
              <LogoutTwoToneIcon />
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {status === "loading" && <LinearProgress />}

      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList status={status} />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"404"} element={<h1>404: PAGE IS NOT FOUND </h1>} />
          <Route path={"*"} element={<Navigate to={"404"} />} />
        </Routes>
      </Container>
      <ErrorSnackbar />
    </div>
  );
}

export default App;
