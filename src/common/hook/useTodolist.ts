import { useCallback, useEffect } from "react";
import { taskThanks, TaskTypeWithEntityTaskStatusType } from "features/todolistsList/tasks/model/tasks-reducer";
import { FilterValuesType } from "features/todolistsList/todolists/model/todolists-reducer";
import { TaskStatuses } from "common/enums/common-enums";
import {useActions} from "./useActions";

export const useTodolist = (
  propsID: string,
  propsRemoveTodolist: (id: string) => void,
  propsChangeTodolistTitle: (id: string, newTitle: string) => void,
  propsChangeFilter: (value: FilterValuesType, todolistId: string) => void,
  propsTasks: Array<TaskTypeWithEntityTaskStatusType>,
  propsFilter: FilterValuesType
) => {

  const {fetchTasks,addTask} = useActions(taskThanks)

  const addTaskCallBack =
    (title: string) => {
      addTask({title, todolistId:propsID});
    }

  useEffect(() => {
    fetchTasks(propsID);
  }, []);

  const removeTodolist = () => {
    propsRemoveTodolist(propsID);
  };
  const changeTodolistTitle = useCallback(
    (title: string) => {
      propsChangeTodolistTitle(propsID, title);
    },
    [propsID, propsChangeTodolistTitle]
  );

  const onAllClickHandler = useCallback(() => propsChangeFilter("all", propsID), [propsID, propsChangeFilter]);
  const onActiveClickHandler = useCallback(() => propsChangeFilter("active", propsID), [propsID, propsChangeFilter]);
  const onCompletedClickHandler = useCallback(
    () => propsChangeFilter("completed", propsID),
    [propsID, propsChangeFilter]
  );

  let tasksForTodolist = propsTasks;

  if (propsFilter === "active") {
    tasksForTodolist = propsTasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (propsFilter === "completed") {
    tasksForTodolist = propsTasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  return {
    addTaskCallBack,
    removeTodolist,
    changeTodolistTitle,
    onAllClickHandler,
    onActiveClickHandler,
    onCompletedClickHandler,
    tasksForTodolist,
  };
};
