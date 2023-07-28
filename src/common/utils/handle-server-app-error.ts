import { ResponseType } from "common/types";
import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";

/**
 * Обрабатывает ошибки, возникающие на стороне сервера, и выполняет соответствующие действия.
 *
 * @template T - тип данных, ожидаемых от сервера
 * @param {ResponseType<T>} data - Данные ответа от сервера, содержащие информацию об ошибке.
 * @param {Dispatch} dispatch - Функция диспетчеризации действий Redux для обновления состояния приложения.
 * @param {boolean} [showError=true] - Флаг, указывающий, нужно ли отображать сообщение об ошибке.
 * @returns {void} - Ничего
 */

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
  // dispatch(appActions.setRequestStatus({ requestStatus: "failed" }));
};
