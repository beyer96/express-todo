import { useAppSelector } from "../store"

export default function Tasks() {
  const tasks = useAppSelector(state => state.tasks);

  console.log(tasks);

  return (
    <h1>Tasks will sit here</h1>

  )
}
