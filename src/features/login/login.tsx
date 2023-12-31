import React from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormikHelpers, useFormik } from "formik";
import { Navigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import styles from "../todolistsList/ui/todolistsList.module.css";
import { selectIsLoggedIn, selectSecurityUrl } from "features/login/login-auth-selectors";
import { useAppSelector } from "common/hook/useAppSelector";
import { authThunk } from "features/login/login-auth-reducer";
import { AuthRequestType } from "features/login/login-auth-api";
import { ResponseType } from "common/types";
import { useActions } from "../../common/hook";

type FormikErrorType = Partial<Omit<AuthRequestType, "captcha">>

const validate = (values: any) => {
  const errors: FormikErrorType = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 4) {
    errors.password = "Password is so short";
  }
  return errors;
};

export const Login = () => {
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn);
  const securityUrl = useAppSelector<string | null>(selectSecurityUrl);

  const { login } = useActions(authThunk);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
      captcha: ""
    },
    validate,
    onSubmit: (values, formikHelpers: FormikHelpers<AuthRequestType>) => {
      login(values)
        .unwrap()
        .catch((reason: ResponseType) => {
          reason.fieldsErrors?.forEach((fieldErrors) => {
            formikHelpers.setFieldError(fieldErrors.field, fieldErrors.error);
          });
        });
    }
  });

  if (isLoggedIn) {
    return <Navigate to={"/"} />;
  }

  return (
    <Grid container justifyContent={"center"} sx={{paddingTop: "100px"}}>
      <Grid item justifyContent={"center"}>
        <Paper elevation={12} className={styles.TodolistPaper}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl>
              <FormLabel>
                <p>
                  To log in get registered
                  <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                    {" "}
                    here
                  </a>
                </p>
                <p>or use common test account credentials:</p>
                <p>Email: free@samuraijs.com</p>
                <p>Password: free</p>
              </FormLabel>
              <FormGroup>
                <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
                {formik.touched.email && formik.errors.email && (
                  <div style={{ color: "red" }}>{formik.errors.email}</div>
                )}

                <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps("password")} />
                {formik.touched.password && formik.errors.password && (
                  <div style={{ color: "red" }}>{formik.errors.password}</div>
                )}

                <FormControlLabel
                  label={"Remember me"}
                  control={<Checkbox checked={formik.values.rememberMe} {...formik.getFieldProps("rememberMe")} />}
                />

                {securityUrl && <img src={securityUrl && securityUrl} alt={"captcha"}/> }
                {securityUrl && <TextField label="captcha" margin="normal" {...formik.getFieldProps("captcha")} /> }


                <Button type={"submit"} disabled={!(formik.isValid && formik.touched)} variant={"contained"}
                        color={"primary"}>
                  Login
                </Button>
              </FormGroup>
            </FormControl>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};
