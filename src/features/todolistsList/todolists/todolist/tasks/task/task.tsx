import React, {FC, memo} from "react";
import { Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import { TaskTypeWithEntityTaskStatusType } from "../../../../tasks/model/tasks-reducer";
import { RequestStatusType } from "app/app-reducer";
import { useTask } from "common/hook";
import { EditableSpan } from "common/components";
import { TaskStatuses } from "common/enums/common-enums";
import s from "./task.module.css"

type Props = {
  task: TaskTypeWithEntityTaskStatusType;
  todolistId: string;
  entityTaskStatus: RequestStatusType;
  entityStatus: RequestStatusType;
  status?: number;
};
export const Task: FC<Props> = memo(({task,todolistId, entityTaskStatus, entityStatus }) => {
  const { removeTaskHandler, changeTaskTitleHandler, changeCheckboxHandler } = useTask(
    task.id,
    todolistId,
  );

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
      <IconButton
        disabled={entityTaskStatus === "loading" || entityStatus === "loading"}
        onClick={removeTaskHandler}
        color={"error"}
      >
        <Delete />
      </IconButton>

      <Checkbox
        disabled={task.entityTaskStatus === "loading"}
        checked={task.status === TaskStatuses.Completed}
        color="primary"
        onChange={changeCheckboxHandler}
      />

      <EditableSpan
        disabled={task.entityTaskStatus === "loading" || entityStatus === "loading"}
        status={+status}
        value={task.title}
        onChange={changeTaskTitleHandler}
      />
    </div>
  );
});
