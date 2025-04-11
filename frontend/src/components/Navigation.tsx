import { NavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/index.js";
import axiosInstance from "../axios.js";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils.js";
import { unsetUser } from "../store/userSlice.js";
import { resetTasks } from "../store/tasksSlice.js";

export default function Navigation() {
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    
    if (response.status === 204) {
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      dispatch(unsetUser())
      dispatch(resetTasks());
    }
  };

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        {user.username
          ? (
            <>
              <li>
              <NavLink to="/tasks">Tasks</NavLink>
            </li>
              <li>
                {user.username}
                <button type="button" className="logout" onClick={handleLogout}>Log out</button>
              </li>
            </>
          )
          : (
            <li>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Sign up</NavLink>
            </li>
          )
        }
      </ul>
    </nav>
  )
}
