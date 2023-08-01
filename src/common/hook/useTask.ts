import { ChangeEvent } from "react";
import {TaskStatuses} from "common/enums/common-enums";
import {useActions} from "./useActions";
import {taskThanks} from "../../features/todolistsList/tasks/model/tasks-reducer";

export const useTask = (
    propsTaskId: string,
    propsTodolistId: string,
) => {

    const {removeTask, updateTask} = useActions(taskThanks)
    const removeTaskHandler = () => {
        removeTask({taskId: propsTaskId, todolistId: propsTodolistId})
    }


    const changeCheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        updateTask({
            taskId: propsTaskId,
            domainModel: {status},
            todolistId: propsTodolistId
        });
    }


    const changeTaskTitleHandler =
        (newTitle: string) => {
            updateTask({taskId: propsTaskId, domainModel: {title: newTitle}, todolistId: propsTodolistId});
        }

    return {
        removeTaskHandler,
        changeTaskTitleHandler,
        changeCheckboxHandler,
    };
};
