import React, {FC} from "react";
import {FilterValuesType} from "../../model/todolists-reducer";
import {TaskTypeWithEntityTaskStatusType} from "../../../tasks/model/tasks-reducer";
import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import {RequestStatusType} from "app/app-reducer";
import styles from "./todolist.module.css";
import {useTodolist} from "common/hook";
import {AddItemForm, EditableSpan} from "common/components";
import {FilterTaskButton} from "../../filter-task-button/filter-task-button";
import {Tasks} from "../tasks/tasks";

type Props = {
    id: string;
    title: string;
    tasks: Array<TaskTypeWithEntityTaskStatusType>;
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};

export const Todolist: FC<Props> = React.memo(function ({id, title, tasks, filter,entityStatus}) {
    console.log("todolist called");
    const {
        addTaskCallBack,
        removeTodolistCallBack,
        changeTodolistTitleCallBack,
    } = useTodolist(
        id,
    );

    return (
        <div>
            <div className={styles.todolist}>
                <IconButton disabled={entityStatus === "loading"} onClick={removeTodolistCallBack}
                            color={"error"}>
                    <Delete/>
                </IconButton>
                <EditableSpan disabled={entityStatus === "loading"} value={title}
                              onChange={changeTodolistTitleCallBack}/>
            </div>

            <AddItemForm disabled={entityStatus === "loading"} addItem={addTaskCallBack}/>

            <Tasks id={id} entityStatus={entityStatus} tasks={tasks} filter={filter}/>

            <div className={styles.buttonGroup}>

                <FilterTaskButton filter={filter} id={id}/>

            </div>
        </div>
    );
});
