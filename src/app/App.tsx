import React, { useEffect } from "react";
import "./App.css";
import { TodolistsList } from "features/todolistsList/todolistsList";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { RequestStatusType } from "./app-reducer";
import { Login } from "features/Login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { authThunk } from "features/Login/login-auth-reducer";
import CircularProgress from "@mui/material/CircularProgress";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import { selectIsInitialized, selectStatus } from "app/app-selectors";
import { selectIsLoggedIn } from "features/Login/login-auth-selectors";
import { useActions, useAppSelector } from "common/hook";
import { ErrorSnackbar } from "common/components";

function App() {
  const status = useAppSelector<RequestStatusType>(selectStatus);
  const isInitialized = useAppSelector<boolean>(selectIsInitialized);
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);

  const { logOut, authMe } = useActions(authThunk);

  const logOutHandler = () => {
    logOut({});
  };

  useEffect(() => {
    authMe({});
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
            <Button color="inherit" onClick={logOutHandler}>
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
