import React from "react";
import { Todolist } from "../todolists/todolist/ui/todolist";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { RequestStatusType } from "app/app-reducer";
import { Navigate } from "react-router-dom";
import styles from "../model/todolistsList.module.css";
import { useTodolistList } from "common/hook";
import { AddItemForm } from "common/components";

type TodolistsListType = {
  status: RequestStatusType;
};
export const TodolistsList: React.FC<TodolistsListType> = () => {
  const {
    isLoggedIn,
    addTodolistStatus,
    tasks,
    todolists,
    addTask,
    changeStatus,
    changeTaskTitle,
    changeFilter,
    removeTodolist,
    changeTodolistTitle,
    addTodolist,
  } = useTodolistList();

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container className={styles.gridContainer}>
        <Paper elevation={12} className={styles.AddItemFormPaper}>
          <AddItemForm disabled={addTodolistStatus === "loading"} addItem={addTodolist} />
        </Paper>
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper elevation={12} className={styles.TodolistPaper}>
                <Todolist
                  id={tl.id}
                  entityStatus={tl.entityStatus}
                  title={tl.title}
                  tasks={allTodolistTasks}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  filter={tl.filter}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
