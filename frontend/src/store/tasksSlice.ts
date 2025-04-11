import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: number;
  title: string;
  description?: string;
  is_done: boolean;
}

const initialState: Task[] = [];

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (_, action: PayloadAction<Task[]>) => {
      return action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.push(action.payload);
    },
    resetTasks: () => initialState
  }
});

export const { setTasks, addTask, resetTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
