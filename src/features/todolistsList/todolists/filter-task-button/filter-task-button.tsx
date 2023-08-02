import Button from "@mui/material/Button";
import React, {FC} from "react";
import {FilterValuesType, todolistsActions} from "../model/todolists-reducer";
import {useActions} from "../../../../common/hook";

type Props = {
    filter: FilterValuesType
    id: string
}

export const FilterTaskButton: FC<Props> = ({filter, id})=>{

    const {changeTodolistFilter} = useActions(todolistsActions);

    const changeFilterHandler = (filter:FilterValuesType)=>{
        changeTodolistFilter({filter, id})
    }

    return (
        <>
            <Button variant={filter === "all" ? "outlined" : "text"} onClick={()=>changeFilterHandler('all')} color={"inherit"}>
                All
            </Button>
            <Button
                variant={filter === "active" ? "outlined" : "text"}
                onClick={()=>changeFilterHandler('active')}
                color={"primary"}
            >
                Active
            </Button>
            <Button
                variant={filter === "completed" ? "outlined" : "text"}
                onClick={()=>changeFilterHandler('completed')}
                color={"secondary"}
            >
                Completed
            </Button>
        </>
    )
}