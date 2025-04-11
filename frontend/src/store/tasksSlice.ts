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
    updateTask: (state, action: PayloadAction<Task>) => {
      const taskIndex = state.findIndex(task => task.id === action.payload.id);
      if (taskIndex === undefined || taskIndex === null) return;

      state[taskIndex] = { ...state[taskIndex], ...action.payload };
      return state;
    },
    removeTask: (state, action: PayloadAction<Task>) => {
      return state.filter(task => task.id !== action.payload.id);
    },
    resetTasks: () => initialState
  }
});

export const { setTasks, addTask, updateTask, removeTask, resetTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
