import { NavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "../store";
import axiosInstance from "../axios";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils";
import { unsetUser } from "../store/userSlice";

export default function Navigation() {
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    
    if (response.status === 204) {
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      dispatch(unsetUser())
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
            <li>
              {user.username}
              <button type="button" className="logout" onClick={handleLogout}>Log out</button>
            </li>
          )
          : (
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          )
        }
      </ul>
    </nav>
  )
}
