import {useCallback, useEffect} from "react";
import {taskThanks, TaskTypeWithEntityTaskStatusType} from "features/todolistsList/tasks/model/tasks-reducer";
import {
    FilterValuesType,
    todolistsActions,
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
    const {changeTodolistFilter} = useActions(todolistsActions);

    const addTaskCallBack =
        (title: string) => {
            addTask({title, todolistId: propsID});
        }

    useEffect(() => {
        fetchTasks(propsID);
    }, []);

    const removeTodolistCallBack = () => {
        removeTodolist({todolistId: propsID});
    };
    const changeTodolistTitleCallBack =
        (title: string) => {
            changeTodolistTitle({id: propsID, title});
        }

    const changeFilterCallBack = (value: FilterValuesType, todolistId: string) => {
        changeTodolistFilter({id: todolistId, filter: value})
    }


    const onAllClickHandler = useCallback(() => changeFilterCallBack("all", propsID), [propsID, changeFilterCallBack]);
    const onActiveClickHandler = useCallback(() => changeFilterCallBack("active", propsID), [propsID, changeFilterCallBack]);
    const onCompletedClickHandler = useCallback(
        () => changeFilterCallBack("completed", propsID),
        [propsID, changeFilterCallBack]
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
        removeTodolistCallBack,
        changeTodolistTitleCallBack,
        onAllClickHandler,
        onActiveClickHandler,
        onCompletedClickHandler,
        tasksForTodolist,
    };
};
