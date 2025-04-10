import { useEffect } from "react";
import { Outlet } from "react-router";
import Navigation from "../components/Navigation";
import { restoreUserSession } from "../services/authService";
import { useAppDispatch } from "../store";
import { setUser } from "../store/userSlice";
import { getTasks } from "../services/tasksService";
import { setTasks } from "../store/tasksSlice";

export default function DefaultLayout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const user = await restoreUserSession();

      dispatch(setUser(user));

      const tasks = await getTasks();
      dispatch(setTasks(tasks));
    })();
  }, [dispatch]);

  return (
    <>
      <Navigation />
      <main className="container">
        <Outlet />
      </main>
    </>
  )
}
