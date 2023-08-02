import {useCallback, useEffect} from "react";
import {taskThanks} from "features/todolistsList/tasks/model/tasks-reducer";
import {
    todolistsThunks
} from "features/todolistsList/todolists/model/todolists-reducer";
import {useActions} from "./useActions";

export const useTodolist = (
    propsID: string,
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

    return {
        addTaskCallBack,
        removeTodolistCallBack,
        changeTodolistTitleCallBack,
    };
};
