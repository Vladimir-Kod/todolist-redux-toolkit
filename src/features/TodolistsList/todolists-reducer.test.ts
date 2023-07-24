import { todolistsReducer, todolistsActions, TodolistDomainType, todolistsThunks } from "./todolists-reducer";

describe("todolists reducer", () => {
  let initialState: TodolistDomainType[];

  beforeEach(() => {
    initialState = [
      { id: "1", title: "Todo 1", addedDate: "", order: 0, filter: "all", entityStatus: "idle" },
      { id: "2", title: "Todo 2", addedDate: "", order: 0, filter: "all", entityStatus: "idle" },
    ];
  });

  it("should handle removeTodolist action correctly", () => {
    const arg = { todolistId: "1" };
    const action = todolistsThunks.removeTodolist.fulfilled(arg, "requestid", arg);
    const newState = todolistsReducer(initialState, action);
    expect(newState.length).toBe(1);
    expect(newState[0].id).toBe("2");
  });

  it("should handle addTodolist action correctly", () => {
    const newTodolist = { id: "3", title: "Todo 3", addedDate: "", order: 0, filter: "all", entityStatus: "idle" };
    const arg = { todolist: newTodolist };
    const action = todolistsThunks.addTodolist.fulfilled(arg, "requestid", { title: "123" });
    const newState = todolistsReducer(initialState, action);
    expect(newState.length).toBe(3);
    expect(newState[0]).toEqual(newTodolist);
  });

  it("should handle changeTodolistTitle action correctly", () => {
    const newTitle = "New title";
    const arg = { id: "1", title: newTitle };
    const action = todolistsThunks.changeTodolistTitle.fulfilled(arg, "requestid", arg);
    const newState = todolistsReducer(initialState, action);
    expect(newState[0].title).toBe(newTitle);
  });

  it("should handle changeTodolistFilter action correctly", () => {
    const newFilter = "active";
    const action = todolistsActions.changeTodolistFilter({ id: "1", filter: newFilter });
    const newState = todolistsReducer(initialState, action);
    expect(newState[0].filter).toBe(newFilter);
  });

  it("should handle setEntityStatus action correctly", () => {
    const newStatus = "loading";
    const action = todolistsActions.setEntityStatus({ id: "1", entityStatus: newStatus });
    const newState = todolistsReducer(initialState, action);
    expect(newState[0].entityStatus).toBe(newStatus);
  });

  it("should handle setTodolists action correctly", () => {
    const newTodolists = [
      { id: "3", title: "Todo 3", addedDate: "", order: 0, filter: "all", entityStatus: "idle" },
      { id: "4", title: "Todo 4", addedDate: "", order: 0, filter: "all", entityStatus: "idle" },
    ];
    const action = todolistsThunks.fetchTodolists.fulfilled({ todolists: newTodolists }, "requestid");
    const newState = todolistsReducer(initialState, action);
    expect(newState.length).toBe(2);
    expect(newState[0]).toEqual(newTodolists[0]);
    expect(newState[1]).toEqual(newTodolists[1]);
  });
});
