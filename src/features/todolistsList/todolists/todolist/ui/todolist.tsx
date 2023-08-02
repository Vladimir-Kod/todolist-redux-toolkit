import React, {FC} from "react";
import {FilterValuesType} from "../../model/todolists-reducer";
import {TaskTypeWithEntityTaskStatusType} from "../../../tasks/model/tasks-reducer";
import {RequestStatusType} from "app/app-reducer";
import styles from "./todolist.module.css";
import {useTodolist} from "common/hook";
import {AddItemForm} from "common/components";
import {FilterTaskButton} from "../../filter-task-button/filter-task-button";
import {Tasks} from "../tasks/tasks";
import {TodolistTitle} from "../todolist-title/todolist-title";

type Props = {
    id: string;
    title: string;
    tasks: Array<TaskTypeWithEntityTaskStatusType>;
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};

export const Todolist: FC<Props> = React.memo(function ({id, title, tasks, filter, entityStatus}) {

    const {
        addTaskCallBack,
    } = useTodolist(
        id,
    );

    return (
        <div>
            <div className={styles.todolist}>

                <TodolistTitle title={title} entityStatus={entityStatus} id={id}/>

            </div>

            <AddItemForm disabled={entityStatus === "loading"} addItem={addTaskCallBack}/>

            <Tasks id={id} entityStatus={entityStatus} tasks={tasks} filter={filter}/>

            <div className={styles.buttonGroup}>

                <FilterTaskButton filter={filter} id={id}/>

            </div>
        </div>
    );
});
