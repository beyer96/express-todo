import { LuCheck, LuSkipBack, LuTrash } from "react-icons/lu";
import { FormEvent, useRef, useState } from "react";
import TasksService from "../services/tasksService";
import { Task as ITask, removeTask, updateTask } from "../store/tasksSlice";
import { useAppDispatch } from "../store";

export default function Task({ task }: { task: ITask }) {
  const dispatch = useAppDispatch();
  const [titleEditable, setTitleEditable] = useState(false);
  const [descriptionEditable, setDescriptionEditable] = useState(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLInputElement>(null);

  const closeEditOnOutsideClick = (
    event: MouseEvent,
    targetInput: HTMLInputElement,
    setInputEditable: (state: boolean) => void
  ) => {
    if (event.target === targetInput) return;

    setInputEditable(false);
  };

  const makeDescriptionEditable = () => {
    const outsideClickHandler = (event: MouseEvent) => {
      closeEditOnOutsideClick(event, descriptionInput.current as HTMLInputElement, setDescriptionEditable);

      document.removeEventListener("click", outsideClickHandler);
    };

    setDescriptionEditable(true);
    requestAnimationFrame(() => {
      descriptionInput.current?.focus();
      document.addEventListener("click", outsideClickHandler);
    });
  }

  const makeTitleEditable = () => {
    const outsideClickHandler = (event: MouseEvent) => {
      closeEditOnOutsideClick(event, titleInput.current as HTMLInputElement, setTitleEditable);

      document.removeEventListener("click", outsideClickHandler);
    }

    setTitleEditable(true);
    requestAnimationFrame(() => {
      titleInput.current?.focus();
      document.addEventListener("click", outsideClickHandler);
    });
  }

  const handleDescriptionInput = async (event: FormEvent) => {
    const pressedKey = (event.nativeEvent as KeyboardEvent).key;

    if (pressedKey === "Escape") {
      setDescriptionEditable(false);
    } else if (pressedKey === "Enter") {
      try {
        const updatedTask = await TasksService.updateTask(task.id, {
          description: descriptionInput.current?.value
        })

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
        const updatedTask = await TasksService.updateTask(task.id, {
          title: titleInput.current?.value
        });

        dispatch(updateTask(updatedTask));
        setTitleEditable(false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const toggleDone = async () => {
    const updatedTask = await TasksService.updateTask(task.id, {
      is_done: !task.is_done
    });

    dispatch(updateTask(updatedTask));
  };

  const handleRemoveTask = async () => {
    try {
      await TasksService.removeTask(task.id);

      dispatch(removeTask(task));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`${task.is_done ? "done" : ""} task d-flex justify-content-between align-items-center`}>
      <div className="d-flex flex-column flex-grow-1 flex-shrink-0 flex-basis-auto">
        {
          titleEditable
            ? <input type="text" onKeyDown={handleTitleInput} ref={titleInput} className="task-title" defaultValue={task.title} />
            : <p onClick={makeTitleEditable} className="task-title">{task.title}</p>
        }
        {
          descriptionEditable
            ? <input onKeyDown={handleDescriptionInput} ref={descriptionInput} className="task-description mt-2" type="text" defaultValue={task.description} />
            : <p onClick={makeDescriptionEditable} className="task-description mt-2">{task.description}</p>
        }
      </div>
      <div className="task-actions d-flex gap-3 ms-5">
        <button onClick={toggleDone} type="button" title={task.is_done ? "Mark as not done" : "Mark as done"}>
          {task.is_done ? <LuSkipBack /> : <LuCheck />}
        </button>
        <button onClick={handleRemoveTask} type="button" title="Delete task">
          <LuTrash />
        </button>
      </div>
    </div>
  )
}