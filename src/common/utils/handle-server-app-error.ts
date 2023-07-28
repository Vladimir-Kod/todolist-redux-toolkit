import { ResponseType } from "common/types";
import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
  dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
};
