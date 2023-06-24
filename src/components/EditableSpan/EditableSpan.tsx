import React from 'react';
import TextField from '@mui/material/TextField';
import useEditableSpan from "./hook/useEditableSpan";

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
    disabled: boolean
    status?: number
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
    console.log('EditableSpan called')

    const {
        editMode,
        title,
        changeTitle,
        activateViewMode,
        activateEditMode,
        opacity,
        lineThrough
    } = useEditableSpan(props.value, props.onChange, props.status)

    return editMode
        ? <TextField disabled={props.disabled} value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode}
                     size={"small"}/>
        : <span style={{padding: "5px", opacity: opacity, textDecoration: lineThrough}}
                onDoubleClick={activateEditMode}>{props.value}</span>
});
