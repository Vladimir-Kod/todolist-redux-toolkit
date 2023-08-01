import React from "react";
import { Task } from "../../../tasks/ui/task";
import { FilterValuesType } from "../../model/todolists-reducer";
import { TaskTypeWithEntityTaskStatusType } from "../../../tasks/model/tasks-reducer";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { RequestStatusType } from "app/app-reducer";
import styles from "./todolist.module.css";
import { useTodolist } from "common/hook";
import { AddItemForm, EditableSpan } from "common/components";

type PropsType = {
  id: string;
  title: string;
  tasks: Array<TaskTypeWithEntityTaskStatusType>;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  removeTodolist: (id: string) => void;
  changeTodolistTitle: (id: string, newTitle: string) => void;
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const Todolist = React.memo(function (props: PropsType) {
  console.log("todolist called");
  const {
    addTask,
    removeTodolist,
    changeTodolistTitle,
    onAllClickHandler,
    onActiveClickHandler,
    onCompletedClickHandler,
    tasksForTodolist,
  } = useTodolist(
    props.addTask,
    props.id,
    props.removeTodolist,
    props.changeTodolistTitle,
    props.changeFilter,
    props.tasks,
    props.filter
  );

  return (
    <div>
      <div className={styles.todolist}>
        <IconButton disabled={props.entityStatus === "loading"} onClick={removeTodolist} color={"error"}>
          <Delete />
        </IconButton>
        <EditableSpan disabled={props.entityStatus === "loading"} value={props.title} onChange={changeTodolistTitle} />
      </div>

      <AddItemForm disabled={props.entityStatus === "loading"} addItem={addTask} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.id}
            status={t.status}
            entityStatus={props.entityStatus}
            entityTaskStatus={t.entityTaskStatus}
          />
        ))}
      </div>
      <div className={styles.buttonGroup}>
        <Button variant={props.filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
          All
        </Button>
        <Button
          variant={props.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={props.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
