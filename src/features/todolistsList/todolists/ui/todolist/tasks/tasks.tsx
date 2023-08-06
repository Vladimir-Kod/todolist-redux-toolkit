import {Task} from "./task/task";
import React, {FC} from "react";
import {TaskTypeWithEntityTaskStatusType} from "../../../../tasks/model/tasks-reducer";
import {RequestStatusType} from "../../../../../../app/app-reducer";
import {TaskStatuses} from "../../../../../../common/enums";
import {FilterValuesType} from "../../../model/todolists-reducer";

type Props = {
    tasks: Array<TaskTypeWithEntityTaskStatusType>
    id: string
    entityStatus: RequestStatusType
    filter: FilterValuesType;
}

export const Tasks: FC<Props> = ({tasks,id,entityStatus, filter})=>{

    let tasksForTodolist = tasks;

    if (filter === "active") {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
    }
    if (filter === "completed") {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
    }

    return (
        <>
            {tasksForTodolist.map((t) => (
                <Task
                    key={t.id}
                    task={t}
                    todolistId={id}
                    status={t.status}
                    entityStatus={entityStatus}
                    entityTaskStatus={t.entityTaskStatus}
                />
            ))}
        </>
    )
}