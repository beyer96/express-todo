import { FormEvent } from "react";
import TasksService from "../services/tasksService";
import { useAppDispatch, useAppSelector } from "../store";
import { addTask, Task } from "../store/tasksSlice";
import { useNavigate } from "react-router";

export default function NewTask() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user);

  const handleCreateTask = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const taskData = Object.fromEntries(formData.entries()) as unknown as Task;
      const { user: taskOwner, ...newTask } = await TasksService.createTask({ ...taskData, user_id: user.id });

      dispatch(addTask(newTask));
      navigate("/tasks");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="text-center">New Task</h1>
      <form onSubmit={handleCreateTask}>
        <div className="input-group">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" />
        </div>

        <div className="input-group">
          <label htmlFor="description">Description</label>
          <input type="text" name="description" id="description" />
        </div>

        <button type="submit" className="btn btn-primary">Create new task</button>
      </form>
    </>
  )
}
