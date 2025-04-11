import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store"
import TasksService from "../services/tasksService";
import { setTasks } from "../store/tasksSlice";
import Task from "../components/Task";

export default function Tasks() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks);
  const user = useAppSelector(state => state.user);

  useEffect(() => {
    if (!user.username) return;

    (async () => {
      const tasks = await TasksService.getTasks();
  
      dispatch(setTasks(tasks));
    })();
  }, [dispatch, user.username]);

  return (
    <>
      <h1>Tasks</h1>
      {tasks.map(task => (
        <Task key={task.id} task={task} />
      ))}
    </>
  )
}
