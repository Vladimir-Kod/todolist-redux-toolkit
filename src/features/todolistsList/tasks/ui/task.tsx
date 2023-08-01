import React from "react";
import { Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import { TaskTypeWithEntityTaskStatusType } from "../model/tasks-reducer";
import { RequestStatusType } from "app/app-reducer";
import { useTask } from "common/hook";
import { EditableSpan } from "common/components";
import { TaskStatuses } from "common/enums/common-enums";

type TaskPropsType = {
  task: TaskTypeWithEntityTaskStatusType;
  todolistId: string;
  entityTaskStatus: RequestStatusType;
  entityStatus: RequestStatusType;
  status?: number;
};
export const Task = React.memo((props: TaskPropsType) => {
  const { removeTaskHandler, changeTaskTitleHandler, changeCheckboxHandler } = useTask(
    props.task.id,
    props.todolistId,
  );

  return (
    <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <IconButton
        disabled={props.task.entityTaskStatus === "loading" || props.entityStatus === "loading"}
        onClick={removeTaskHandler}
        color={"error"}
      >
        <Delete />
      </IconButton>

      <Checkbox
        disabled={props.task.entityTaskStatus === "loading"}
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={changeCheckboxHandler}
      />

      <EditableSpan
        disabled={props.task.entityTaskStatus === "loading" || props.entityStatus === "loading"}
        status={props.status}
        value={props.task.title}
        onChange={changeTaskTitleHandler}
      />
    </div>
  );
});
