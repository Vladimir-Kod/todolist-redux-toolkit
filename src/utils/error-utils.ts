import { Dispatch } from "redux";
import { ResponseType } from "api/todolists-api";
import { appActions } from "app/app-reducer";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setError({ error: "Some error occurred" }));
  }
  dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
};

export const handleServerNetworkError = (error: string, dispatch: Dispatch) => {
  dispatch(appActions.setError({ error }));
  dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
};
