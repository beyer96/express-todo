import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import tasksReducer from "./tasksSlice";
import projectsReducer from "./projectsSlice";
import { useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
    projects: projectsReducer
  }
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export default store;
