import { NavLink } from "react-router";
import { useAppSelector } from "../store";

export default function Navigation() {
  const user = useAppSelector(state => state.user);

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        {user.username
          ? user.username
          : (<li>
            <NavLink to="/login">Login</NavLink>
          </li>)
        }
      </ul>
    </nav>
  )
}
