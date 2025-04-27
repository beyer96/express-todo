import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store"
import { setTasks } from "../store/tasksSlice";
import Task from "../components/Task";
import { Link, useLoaderData } from "react-router";

export default function Tasks() {
  const dispatch = useAppDispatch();
  const { tasks: loadedTasks } = useLoaderData();
  const tasks = useAppSelector(state => state.tasks);
  const user = useAppSelector(state => state.user);

  useEffect(() => {
    if (!user.username) return;

    dispatch(setTasks(loadedTasks));
  }, [dispatch, loadedTasks, user]);

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
