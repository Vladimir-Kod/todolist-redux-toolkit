import {useCallback} from "react";
import {TaskStatuses} from "../../../../api/todolists-api";
import {TaskTypeWithEntityTaskStatusType} from "../../tasks-reducer";
import {FilterValuesType} from "../../todolists-reducer";

const useTodolist = (
    propsAddTask:(title: string, todolistId: string) => void,
    propsID:string,
    propsRemoveTodolist: (id: string) => void,
    propsChangeTodolistTitle:(id: string, newTitle: string) => void,
    propsChangeFilter:(value: FilterValuesType, todolistId: string) => void,
    propsTasks:Array<TaskTypeWithEntityTaskStatusType>,
    propsFilter:FilterValuesType
)=>{
    const addTask = useCallback((title: string) => {
        propsAddTask(title, propsID)
    }, [propsAddTask, propsID])

    const removeTodolist = () => {
        propsRemoveTodolist(propsID)
    }
    const changeTodolistTitle = useCallback((title: string) => {
        propsChangeTodolistTitle(propsID, title)
    }, [propsID, propsChangeTodolistTitle])

    const onAllClickHandler = useCallback(() => propsChangeFilter('all', propsID), [propsID, propsChangeFilter])
    const onActiveClickHandler = useCallback(() => propsChangeFilter('active', propsID), [propsID, propsChangeFilter])
    const onCompletedClickHandler = useCallback(() => propsChangeFilter('completed', propsID), [propsID, propsChangeFilter])


    let tasksForTodolist = propsTasks

    if (propsFilter === 'active') {
        tasksForTodolist = propsTasks.filter(t => t.status === TaskStatuses.New)
    }
    if (propsFilter === 'completed') {
        tasksForTodolist = propsTasks.filter(t => t.status === TaskStatuses.Completed)
    }
    return {
        addTask,
        removeTodolist,
        changeTodolistTitle,
        onAllClickHandler,
        onActiveClickHandler,
        onCompletedClickHandler,
        tasksForTodolist
    }
}

export default useTodolist