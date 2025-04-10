import { useNavigate } from "react-router";
import axiosInstance from "../axios";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils";
import { setUser } from "../store/userSlice";
import { useAppDispatch } from "../store";

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
    <form action={handleLogin}>
      <input type="text" name="username" id="username" />
      <input type="password" name="password" id="password" />
      <button type="submit">Login</button>
    </form>
  )
}
