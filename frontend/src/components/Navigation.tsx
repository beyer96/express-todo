import { useSelector } from "react-redux";
import { NavLink } from "react-router";

export default function Navigation() {
  const user = useSelector(state => state.user);

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
