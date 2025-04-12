import { FormEvent } from "react";
import { registerNewUser, UserData } from "../services/authService"
import { useAppDispatch } from "../store";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router";

export default function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSignup = async (event: FormEvent) => {
    try {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const userData = Object.fromEntries(formData.entries()) as unknown as UserData;
      const user = await registerNewUser(userData);

      dispatch(setUser(user));
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSignup} className="form-signup">
      <div className="input-group">
        <label htmlFor="firstName">First name</label>
        <input type="text" name="firstName" id="firstName" />
      </div>

      <div className="input-group">
        <label htmlFor="lastName">Last name</label>
        <input type="text" name="lastName" id="lastName" />
      </div>

      <div className="input-group">
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
      </div>

      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </div>

      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>

      <div className="input-group">
        <label htmlFor="confirmPassword">Confirm password</label>
        <input type="password" id="confirmPassword" />
      </div>

      <button className="btn" type="submit">Register</button>
    </form>
  )
}
