import {todolistsReducer, addTodolistAC, removeTodolistAC, TodolistDomainType} from './todolists-reducer';

test('adding a new todolist should update the state correctly', () => {
    const initialState:Array<TodolistDomainType> = [];
    const action = addTodolistAC({ id: '123', title: 'New Todolist', addedDate: "", order:0 });

    const newState = todolistsReducer(initialState, action);

    expect(newState.length).toBe(1);
    expect(newState[0].title).toBe('New Todolist');
});

test('removing a todolist should update the state correctly', () => {
    const initialState:TodolistDomainType[] = [
        { id: '123', title: 'Todolist 1', addedDate: "", order:0,filter:"all",entityStatus: "idle"},
        { id: '456', title: 'Todolist 2' , addedDate: "", order:0,filter:"all",entityStatus: "idle"},
    ];
    const action = removeTodolistAC('123');

    const newState = todolistsReducer(initialState, action);

    expect(newState.length).toBe(1);
    expect(newState[0].title).toBe('Todolist 2');
});