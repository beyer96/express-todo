import { LuCheck, LuTrash } from "react-icons/lu";
import { Task as ITask, updateTask } from "../store/tasksSlice";
import { FormEvent, useRef, useState } from "react";
import axiosInstance from "../axios";
import { useAppDispatch } from "../store";

export default function Task({ task }: { task: ITask }) {
  const dispatch = useAppDispatch();
  const [titleEditable, setTitleEditable] = useState(false);
  const [descriptionEditable, setDescriptionEditable] = useState(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLInputElement>(null);

  const makeDescriptionEditable = () => {
    setDescriptionEditable(true);

    requestAnimationFrame(() => {
      descriptionInput.current?.focus();
    });
  }

  const makeTitleEditable = () => {
    setTitleEditable(true);

    requestAnimationFrame(() => {
      titleInput.current?.focus();
    });
  }

  const handleDescriptionInput = async (event: FormEvent) => {
    const pressedKey = (event.nativeEvent as KeyboardEvent).key;

    if (pressedKey === "Escape") {
      setDescriptionEditable(false);
    } else if (pressedKey === "Enter") {
      try {
        const response = await axiosInstance.put(`/tasks/${task.id}`, {
          description: descriptionInput.current?.value
        });
        const updatedTask = response.data;

        dispatch(updateTask(updatedTask));
        setDescriptionEditable(false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleTitleInput = async (event: FormEvent) => {
    const pressedKey = (event.nativeEvent as KeyboardEvent).key;

    if (pressedKey === "Escape") {
      setTitleEditable(false);
    } else if (pressedKey === "Enter") {
      try {
        const response = await axiosInstance.put(`/tasks/${task.id}`, {
          title: titleInput.current?.value
        });
        const updatedTask = response.data;

        dispatch(updateTask(updatedTask));
        setTitleEditable(false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="task d-flex justify-content-between align-items-center">
      <div className="d-flex flex-column">
        {
          titleEditable
            ? <input type="text" onKeyDown={handleTitleInput} ref={titleInput} className="task-title" defaultValue={task.title} />
            : <p onClick={makeTitleEditable} className="task-title">{task.title}</p>
        }
        {
          descriptionEditable
            ? <input onKeyDown={handleDescriptionInput} ref={descriptionInput} className="task-description" type="text" defaultValue={task.description} />
            : <p onClick={makeDescriptionEditable} className="task-description mt-2">{task.description}</p>
        }
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