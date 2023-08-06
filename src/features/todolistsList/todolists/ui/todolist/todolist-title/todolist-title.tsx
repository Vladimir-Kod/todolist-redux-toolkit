import IconButton from "@mui/material/IconButton";
import {Delete} from "@mui/icons-material";
import {EditableSpan} from "../../../../../../common/components";
import React, {FC} from "react";
import {RequestStatusType} from "../../../../../../app/app-reducer";
import {useActions} from "../../../../../../common/hook";
import {todolistsThunks} from "../../../model/todolists-reducer";


type Props = {
    entityStatus: RequestStatusType
    title: string
    id: string
}

export const TodolistTitle: FC<Props> = ({entityStatus,title, id}) =>{

    const {removeTodolist, changeTodolistTitle} = useActions(todolistsThunks)

    const removeTodolistCallBack = () => {
        removeTodolist({todolistId: id});
    }

    const changeTodolistTitleCallBack = (title: string) => {
        changeTodolistTitle({id, title});
    }

    return (
        <>
            <IconButton disabled={entityStatus === "loading"} onClick={removeTodolistCallBack}
                        color={"error"}>
                <Delete/>
            </IconButton>
            <EditableSpan disabled={entityStatus === "loading"} value={title}
                          onChange={changeTodolistTitleCallBack}/>
        </>
    )
}