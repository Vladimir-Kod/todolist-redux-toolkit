import React from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { AddBox } from "@mui/icons-material";
import { useAddItemForm } from "common/hook";

type AddItemFormPropsType = {
  addItem: (title: string) => void;
  disabled: boolean;
};
export const AddItemForm = React.memo(function (props: AddItemFormPropsType) {
  console.log("AddItemForm called");

  const { title, onChangeHandler, onKeyPressHandler, addItem, error } = useAddItemForm(props.addItem);

  return (
    <div>
      <TextField
        variant="outlined"
        disabled={props.disabled}
        error={!!error}
        value={title}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        label="Title"
        helperText={error}
      />
      <IconButton disabled={props.disabled} color="primary" onClick={addItem}>
        <AddBox fontSize={"large"} />
      </IconButton>
    </div>
  );
});
