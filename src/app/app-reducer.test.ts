// import { appReducer } from "./app-reducer";
//
// describe("app", () => {
//   it("should set request status", () => {
//     const action = AppInitialStateType({status:"loading"});
//     const newState = appReducer(initialState, action);
//     expect(newState.status).toBe("loading");
//   });
//
//   it("should set error", () => {
//     const action = setErrorAC("Some error occurred");
//     const newState = appReducer(initialState, action);
//     expect(newState.error).toBe("Some error occurred");
//   });
//
//   it("should set initialized status", () => {
//     const action = setIsInitializedAC(true);
//     const newState = appReducer(initialState, action);
//     expect(newState.isInitialized).toBe(true);
//   });
//
//   it("should set add todo list status", () => {
//     const action = setAddTodoListStatusAC("loading");
//     const newState = appReducer(initialState, action);
//     expect(newState.addTodoListStatus).toBe("loading");
//   });
// });
