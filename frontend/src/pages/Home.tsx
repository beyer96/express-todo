import { useEffect } from "react";
import { LuListTodo, LuFolderGit, LuClipboardCheck } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "../store"
import Stat from "../components/Stat";
import { IconContext } from "react-icons/lib";
import TasksService from "../services/tasksService";
import { setTasks } from "../store/tasksSlice";
import ProjectsService from "../services/projectsService";
import { setProjects } from "../store/projectsSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const tasks = useAppSelector(state => state.tasks);
  const projects = useAppSelector(state => state.projects);

  useEffect(() => {
    if (!user.username) return;

    (async () => {
      const tasks = await TasksService.getTasks();
      const projects = await ProjectsService.getProjects();
  
      dispatch(setTasks(tasks));
      dispatch(setProjects(projects));
    })();
  }, [dispatch, user.username]);

  if (user.username) {
    return (
      <>
        <h1 className="text-center mt-5">Welcome, {user.username}!</h1>
        <div className="d-flex justify-content-center my-5 gap-5">
          <Stat title="Tasks to be done" value={tasks.filter(task => !task.is_done).length}>
            <IconContext.Provider value={{ size: "6rem" }}>
              <LuListTodo />
            </IconContext.Provider>
          </Stat>
          <Stat title="Opened projects" value={projects.filter(project => !project.is_done).length}>
            <IconContext.Provider value={{ size: "6rem" }}>
              <LuFolderGit />
            </IconContext.Provider>
          </Stat>
          <Stat title="Done tasks" value={tasks.filter(task => task.is_done).length}>
            <IconContext.Provider value={{ size: "6rem" }}>
              <LuClipboardCheck />
            </IconContext.Provider>
          </Stat>
        </div>
      </>
    )
  } else {
    return (
      <h1>You are not logged in!</h1>
    )
  }
}
