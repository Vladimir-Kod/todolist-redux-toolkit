import {useCallback, useEffect} from "react";
import {taskThanks, TaskTypeWithEntityTaskStatusType} from "features/todolistsList/tasks/model/tasks-reducer";
import {
    FilterValuesType,
    todolistsThunks
} from "features/todolistsList/todolists/model/todolists-reducer";
import {TaskStatuses} from "common/enums/common-enums";
import {useActions} from "./useActions";

export const useTodolist = (
    propsID: string,
    propsTasks: Array<TaskTypeWithEntityTaskStatusType>,
    propsFilter: FilterValuesType
) => {

    const {fetchTasks, addTask, removeTodolist, changeTodolistTitle} = useActions({...taskThanks, ...todolistsThunks})

    const addTaskCallBack =
        (title: string) => {
            addTask({title, todolistId: propsID});
        }

    useEffect(() => {
        fetchTasks(propsID);
    }, []);

    const removeTodolistCallBack = useCallback(() => {
        removeTodolist({todolistId: propsID});
    },[propsID, removeTodolist]);

    const changeTodolistTitleCallBack = useCallback((title: string) => {
        changeTodolistTitle({id: propsID, title});
    },[propsID, changeTodolistTitle],)

    let tasksForTodolist = propsTasks;

    if (propsFilter === "active") {
        tasksForTodolist = propsTasks.filter((t) => t.status === TaskStatuses.New);
    }
    if (propsFilter === "completed") {
        tasksForTodolist = propsTasks.filter((t) => t.status === TaskStatuses.Completed);
    }
    return {
        addTaskCallBack,
        removeTodolistCallBack,
        changeTodolistTitleCallBack,
        tasksForTodolist,
    };
};
