import {ChangeEvent, KeyboardEvent, useState} from "react";
import {RejectValueType} from "../utils/create-app-async-thunk";

export const useAddItemForm = (propsAddItem: (title: string) => Promise<any>) => {
    let [title, setTitle] = useState("");
    let [error, setError] = useState<string | null>(null);

    const addItem = () => {
        if (title.trim() !== "") {
            propsAddItem(title)
                .then(res => {
                    setTitle("");
                }).catch((err: RejectValueType) => {
                if (err.data) {
                    const messages = err.data.messages
                    setError(messages.length ? messages[0] : 'Some error occurred')
                }
            })

        } else {
            setError("Title is required");
        }
    };

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItem();
        }
    };
    return {
        title,
        onChangeHandler,
        onKeyPressHandler,
        addItem,
        error,
    };
};
