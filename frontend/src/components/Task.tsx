import { LuCheck, LuTrash } from "react-icons/lu";
import { Task as ITask } from "../store/tasksSlice";

export default function Task({ task }: { task: ITask }) {
  return (
    <div className="task d-flex justify-content-between align-items-center">
      <div className="d-flex flex-column">
        <p className="task-title">{task.title}</p>
        <p className="task-description mt-2">{task.description}</p>
      </div>
      <div className="task-actions d-flex gap-3">
        <button type="button" title={task.is_done ? "Mark as not done" : "Mark as done"}>
          <LuCheck />
        </button>
        <button type="button" title="Delete task">
          <LuTrash />
        </button>
      </div>
    </div>
  )
}