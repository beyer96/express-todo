import { useNavigate } from "react-router";
import axiosInstance from "../axios";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils";

export default function Login() {
  const navigate = useNavigate();

  async function handleLogin(formData: FormData) {
    try {
      const response = await axiosInstance.post("/auth/signin", {
        username: formData.get("username"),
        password: formData.get("password")
      });
      const { accessToken } = response.data;

      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
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
