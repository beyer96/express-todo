import { useEffect } from "react";
import { Outlet } from "react-router";
import Navigation from "../pages/Navigation";
import { restoreUserSession } from "../services/authService";
import { useAppDispatch } from "../store";
import { setUser } from "../store/userSlice";

export default function DefaultLayout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const user = await restoreUserSession();

      dispatch(setUser(user));
    })();
  }, [dispatch]);

  return (
    <>
      <Navigation />
      <Outlet />
    </>
  )
}
