import { FormEvent, useState } from "react";

export default function Login() {
  const [credentials, setCredentials] = useState({});

  function handleLogin() {
    console.log(credentials);
  }

  function handleInput(event: FormEvent) {
    const input = event.currentTarget as HTMLInputElement;
    const { name, value } = input;

    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  }

  return (
    <form action={handleLogin}>
      <input type="text" name="username" id="username" onInput={handleInput} />
      <input type="password" name="password" id="password" onInput={handleInput} />
      <button type="submit">Login</button>
    </form>
  )
}
