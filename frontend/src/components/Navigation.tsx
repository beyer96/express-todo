import { NavLink } from "react-router";

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/auth">Login</NavLink>
        </li>
      </ul>
    </nav>
  )
}
