import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store"
import TasksService from "../services/tasksService";
import { setTasks } from "../store/tasksSlice";
import Task from "../components/Task";
import { Link } from "react-router";

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
      <div className="d-flex justify-content-between align-items-center">
        <h1>Tasks</h1>
        <Link to="/tasks/new" className="btn btn-primary">Create new task</Link>
      </div>
      {tasks.map(task => (
        <Task key={task.id} task={task} />
      ))}
    </>
  )
}
