import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  id: number;
  title: string;
  is_done: boolean;
}

const initialState: Project[] = [];

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (_, action: PayloadAction<Project[]>) => {
      return action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const projectIndex = state.findIndex(project => project.id === action.payload.id);
      if (projectIndex === undefined || projectIndex === null) return;

      state[projectIndex] = { ...state[projectIndex], ...action.payload };
      return state;
    },
    removeProject: (state, action: PayloadAction<Project>) => {
      return state.filter(project => project.id !== action.payload.id);
    },
    resetProjects: () => initialState,
  }
});

export const { addProject, setProjects, updateProject, removeProject, resetProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
