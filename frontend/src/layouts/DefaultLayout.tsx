import { useEffect } from "react";
import { Outlet } from "react-router";
import Navigation from "../components/Navigation";
import { restoreUserSession } from "../services/authService";
import { useAppDispatch } from "../store";
import { setUser } from "../store/userSlice";

export default function DefaultLayout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const user = await restoreUserSession();
      if (!user) return;

      dispatch(setUser(user));
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
