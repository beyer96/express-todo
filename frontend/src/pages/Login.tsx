import { useNavigate } from "react-router";
import axiosInstance from "../axios.js";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils.js";
import { setUser } from "../store/userSlice.js";
import { useAppDispatch } from "../store/index.js";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function handleLogin(formData: FormData) {
    try {
      const response = await axiosInstance.post("/auth/signin", {
        username: formData.get("username"),
        password: formData.get("password")
      });
      const { accessToken, user } = response.data;

      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
      dispatch(setUser(user));
      navigate("/");      
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return (
    <form action={handleLogin} className="form-login">
      <div className="input-group">
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
      </div>

      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>

      <button type="submit">Login</button>
    </form>
  )
}
