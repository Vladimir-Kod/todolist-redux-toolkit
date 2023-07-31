import { ChangeEvent, useCallback } from "react";
import { TaskStatuses } from "common/enums/common-enums";
import {useActions} from "./useActions";
import {taskThanks} from "../../features/todolistsList/tasks/model/tasks-reducer";

export const useTask = (
  propsTaskId: string,
  propsTodolistId: string,
  propsChangeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void,
  propsChangeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
) => {

  const {removeTask} = useActions(taskThanks)
  const removeTaskHandler = () => {
    removeTask({ taskId: propsTaskId, todolistId: propsTodolistId})
  }



  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      propsChangeTaskStatus(propsTaskId, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, propsTodolistId);
    },
    [propsTaskId, propsTodolistId]
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      propsChangeTaskTitle(propsTaskId, newValue, propsTodolistId);
    },
    [propsTaskId, propsTodolistId]
  );

  return {
    removeTaskHandler,
    onTitleChangeHandler,
    onChangeHandler,
  };
};
