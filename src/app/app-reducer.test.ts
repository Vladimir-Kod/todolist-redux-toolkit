import { appReducer, appActions, AppInitialStateType, RequestStatusType } from "./app-reducer";

describe("app reducer", () => {
  let initialState: AppInitialStateType;

  beforeEach(() => {
    initialState = {
      isInitialized: false,
      status: "idle",
      error: null,
      addTodoListStatus: "idle",
    };
  });

  it("should handle setRequestStatus action correctly", () => {
    const newStatus: RequestStatusType = "loading";
    const action = appActions.setRequestStatus({ requestStatus: newStatus });
    const newState = appReducer(initialState, action);
    expect(newState.status).toBe(newStatus);
  });

  it("should handle setError action correctly", () => {
    const newError = "Something went wrong";
    const action = appActions.setError({ error: newError });
    const newState = appReducer(initialState, action);
    expect(newState.error).toBe(newError);
  });

  it("should handle setIsInitialized action correctly", () => {
    const newIsInitializedValue = true;
    const action = appActions.setIsInitialized({ isInitialized: newIsInitializedValue });
    const newState = appReducer(initialState, action);
    expect(newState.isInitialized).toBe(newIsInitializedValue);
  });

  it("should handle setAddTodoListStatus action correctly", () => {
    const newStatus: RequestStatusType = "loading";
    const action = appActions.setAddTodoListStatus({ todoListStatus: newStatus });
    const newState = appReducer(initialState, action);
    expect(newState.addTodoListStatus).toBe(newStatus);
  });
});
