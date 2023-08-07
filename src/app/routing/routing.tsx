import {Navigate, Route, Routes} from "react-router-dom";
import {TodolistsList} from "../../features/todolistsList/ui/todolistsList";
import {Login} from "../../features/login/login";
import Container from "@mui/material/Container";
import React from "react";
import {useAppSelector} from "../../common/hook";
import {RequestStatusType} from "../app-reducer";
import {selectStatus} from "../app-selectors";

export const Routing =()=>{
    const status = useAppSelector<RequestStatusType>(selectStatus);
    return (
        <>
            <Container fixed>
                <Routes>
                    <Route path={"/"} element={<TodolistsList status={status} />} />
                    <Route path={"/login"} element={<Login />} />
                    <Route path={"404"} element={<h1>404: PAGE IS NOT FOUND </h1>} />
                    <Route path={"*"} element={<Navigate to={"404"} />} />
                </Routes>
            </Container>
        </>
    )
}