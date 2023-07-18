import { ChangeEvent, useState } from "react";

const useEditableSpan = (propsValue: string, propsOnChange: (newValue: string) => void, propsStatus?: number) => {
  let [editMode, setEditMode] = useState(false);
  let [title, setTitle] = useState(propsValue);

  const activateEditMode = () => {
    setEditMode(true);
    setTitle(propsValue);
  };
  const activateViewMode = () => {
    setEditMode(false);
    propsOnChange(title);
  };
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const opacity = propsStatus === 2 ? 0.4 : undefined;
  const lineThrough = propsStatus === 2 ? "line-through" : undefined;

  return {
    editMode,
    title,
    changeTitle,
    activateViewMode,
    activateEditMode,
    opacity,
    lineThrough,
  };
};

export default useEditableSpan;
