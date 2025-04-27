import { Link, useLoaderData } from "react-router";
import { LuListTodo, LuFolderGit, LuClipboardCheck } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "../store"
import Stat from "../components/Stat";
import { IconContext } from "react-icons/lib";
import { setTasks } from "../store/tasksSlice";
import { setProjects } from "../store/projectsSlice";
import { useEffect } from "react";

export default function Home() {
  const user = useAppSelector(state => state.user);
  const tasks = useAppSelector(state => state.tasks);
  const projects = useAppSelector(state => state.projects);
  const dispatch = useAppDispatch();
  const { tasks: loadedTasks, projects: loadedProjects } = useLoaderData();

  useEffect(() => {
    if (user.username) {
      console.log("WTF");
      dispatch(setTasks(loadedTasks));
      dispatch(setProjects(loadedProjects));
    }
  }, [dispatch, loadedTasks, loadedProjects, user]);


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
      <section className="text-center mt-5">
        <h1>You are not logged in!</h1>
        <p>Nothing to be seen here, unless you are a user of this app.</p>
        <p className="mt-3"><Link to="/login">Log in</Link> or <Link to="/signup">sign up</Link> to continue.</p>
      </section>
    )
  }
}
