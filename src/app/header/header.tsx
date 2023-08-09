import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import AppBar from "@mui/material/AppBar";
import React from "react";
import {useActions, useAppSelector} from "../../common/hook";
import {selectIsLoggedIn} from "../../features/login/login-auth-selectors";
import {authThunk} from "../../features/login/login-auth-reducer";

export const Header = () =>{
    const { logOut } = useActions(authThunk);
    const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);

    const logOutHandler = () => {
        logOut({});
    };

    return (
        <>
            <AppBar color={"inherit"} position="static" >
                <Toolbar className="AppToolbar" >
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
        </>
    )
}