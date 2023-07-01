// import { tasksActions, tasksReducer, TasksStateType, taskThanks } from "./tasks-reducer";
// import { TaskStatuses, TaskType } from "api/todolists-api";
//
// describe("tasks reducer", () => {
//   let startState: TasksStateType = {};
//
//   beforeEach(() => {
//     startState = {
//       todolistId1: [
//         {
//           id: "1",
//           title: "HTML&CSS",
//           status: TaskStatuses.New,
//           todoListId: "todolistId1",
//           description: "",
//           startDate: "",
//           deadline: "",
//           priority: 0,
//           order: 0,
//           addedDate: "",
//           entityTaskStatus: "idle",
//         },
//         {
//           id: "2",
//           title: "JS",
//           status: TaskStatuses.Completed,
//           todoListId: "todolistId1",
//           description: "",
//           startDate: "",
//           deadline: "",
//           priority: 0,
//           order: 0,
//           addedDate: "",
//           entityTaskStatus: "idle",
//         },
//         {
//           id: "3",
//           title: "ReactJS",
//           status: TaskStatuses.New,
//           todoListId: "todolistId1",
//           description: "",
//           startDate: "",
//           deadline: "",
//           priority: 0,
//           order: 0,
//           addedDate: "",
//           entityTaskStatus: "idle",
//         },
//       ],
//       todolistId2: [
//         {
//           id: "1",
//           title: "bread",
//           status: TaskStatuses.New,
//           todoListId: "todolistId2",
//           description: "",
//           startDate: "",
//           deadline: "",
//           priority: 0,
//           order: 0,
//           addedDate: "",
//           entityTaskStatus: "idle",
//         },
//         {
//           id: "2",
//           title: "milk",
//           status: TaskStatuses.Completed,
//           todoListId: "todolistId2",
//           description: "",
//           startDate: "",
//           deadline: "",
//           priority: 0,
//           order: 0,
//           addedDate: "",
//           entityTaskStatus: "idle",
//         },
//         {
//           id: "3",
//           title: "tea",
//           status: TaskStatuses.New,
//           todoListId: "todolistId2",
//           description: "",
//           startDate: "",
//           deadline: "",
//           priority: 0,
//           order: 0,
//           addedDate: "",
//           entityTaskStatus: "idle",
//         },
//       ],
//     };
//   });
//
//   it("correct task should be deleted from correct array", () => {
//     const action = tasksActions.removeTask({ taskId: "2", todolistId: "todolistId2" });
//
//     const endState = tasksReducer(startState, action);
//
//     expect(endState["todolistId1"].length).toBe(3);
//     expect(endState["todolistId2"].length).toBe(2);
//     expect(endState["todolistId2"].every((t) => t.id !== "2")).toBeTruthy();
//     expect(endState).not.toBe(startState);
//   });
//
//   it("correct task should be added to correct array", () => {
//     const task: TaskType = {
//       id: "4",
//       title: "juice",
//       status: TaskStatuses.New,
//       todoListId: "todolistId2",
//       description: "",
//       startDate: "",
//       deadline: "",
//       priority: 0,
//       order: 0,
//       addedDate: "",
//     };
//
//     const action = taskThanks.addTask.fulfilled({ task: task }, "requestid", {});
//
//     const endState = tasksReducer(startState, action);
//
//     expect(endState["todolistId1"].length).toBe(3);
//     expect(endState["todolistId2"].length).toBe(4);
//     expect(endState["todolistId2"][0].id).toBeDefined();
//     expect(endState["todolistId2"][0].title).toBe("juice");
//     expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
//     expect(endState).not.toBe(startState);
//   });
//
//   it("status of specified task should be changed", () => {
//     const action = tasksActions.updateTask({
//       taskId: "2",
//       model: { status: TaskStatuses.New },
//       todolistId: "todolistId2",
//     });
//
//     const endState = tasksReducer(startState, action);
//
//     expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
//     expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
//     expect(endState).not.toBe(startState);
//   });
//
//   it("title of specified task should be changed", () => {
//     const action = tasksActions.updateTask({ taskId: "2", model: { title: "MilkyWay" }, todolistId: "todolistId2" });
//
//     const endState = tasksReducer(startState, action);
//
//     expect(endState["todolistId1"][1].title).toBe("JS");
//     expect(endState["todolistId2"][1].title).toBe("MilkyWay");
//     expect(endState).not.toBe(startState);
//   });
// });
