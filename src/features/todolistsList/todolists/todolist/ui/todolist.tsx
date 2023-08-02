import React from "react";
import { Task } from "../../../tasks/ui/task";
import { FilterValuesType } from "../../model/todolists-reducer";
import { TaskTypeWithEntityTaskStatusType } from "../../../tasks/model/tasks-reducer";
import IconButton from "@mui/material/IconButton";
import { Delete } from "@mui/icons-material";
import { RequestStatusType } from "app/app-reducer";
import styles from "./todolist.module.css";
import { useTodolist } from "common/hook";
import { AddItemForm, EditableSpan } from "common/components";
import {FilterTaskButton} from "../../filter-task-button/filter-task-button";

type PropsType = {
  id: string;
  title: string;
  tasks: Array<TaskTypeWithEntityTaskStatusType>;
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const Todolist = React.memo(function (props: PropsType) {
  console.log("todolist called");
  const {
    addTaskCallBack,
    removeTodolistCallBack,
    changeTodolistTitleCallBack,
    tasksForTodolist,
  } = useTodolist(
    props.id,
    props.tasks,
    props.filter
  );

  return (
    <div>
      <div className={styles.todolist}>
        <IconButton disabled={props.entityStatus === "loading"} onClick={removeTodolistCallBack} color={"error"}>
          <Delete />
        </IconButton>
        <EditableSpan disabled={props.entityStatus === "loading"} value={props.title} onChange={changeTodolistTitleCallBack} />
      </div>

      <AddItemForm disabled={props.entityStatus === "loading"} addItem={addTaskCallBack} />
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
        <FilterTaskButton filter={props.filter} id={props.id}/>
      </div>
    </div>
  );
});
