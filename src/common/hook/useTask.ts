import { ChangeEvent, useCallback } from "react";
import { TaskStatuses } from "common/enums/common-enums";

export const useTask = (
  propsRemoveTask: (taskId: string, todolistId: string) => void,
  propsTaskId: string,
  propsTodolistId: string,
  propsChangeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void,
  propsChangeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
) => {
  const onClickHandler = useCallback(
    () => propsRemoveTask(propsTaskId, propsTodolistId),
    [propsTaskId, propsTodolistId]
  );

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
    onClickHandler,
    onTitleChangeHandler,
    onChangeHandler,
  };
};
