import { ResponseType } from "common/api/todolists-api";
import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
};
