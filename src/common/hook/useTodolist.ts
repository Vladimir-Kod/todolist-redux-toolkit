import {useEffect} from "react";
import {taskThanks} from "features/todolistsList/tasks/model/tasks-reducer";
import {
    todolistsThunks
} from "features/todolistsList/todolists/model/todolists-reducer";
import {useActions} from "./useActions";

export const useTodolist = (
    propsID: string,
) => {

    const {fetchTasks, addTask} = useActions({...taskThanks, ...todolistsThunks})

    const addTaskCallBack =
        (title: string) => {
            return addTask({title, todolistId: propsID}).unwrap();
        }

    useEffect(() => {
        fetchTasks(propsID);
    }, []);

    return {
        addTaskCallBack,
    };
};
