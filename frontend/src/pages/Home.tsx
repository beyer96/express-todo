import { LuListTodo, LuFolderGit, LuClipboardCheck } from "react-icons/lu";
import { useAppSelector } from "../store"
import Stat from "../components/Stat";
import { IconContext } from "react-icons/lib";

export default function Home() {
  const user = useAppSelector(state => state.user);

  if (user.username) {
    return (
      <>
        <h1 className="text-center mt-5">Welcome, {user.username}!</h1>
        <div className="d-flex justify-content-center my-5 gap-5">
          <Stat title="Tasks to be done" value={15}>
            <IconContext.Provider value={{ size: "6rem" }}>
              <LuListTodo />
            </IconContext.Provider>
          </Stat>
          <Stat title="Opened projects" value={3}>
            <IconContext.Provider value={{ size: "6rem" }}>
              <LuFolderGit />
            </IconContext.Provider>
          </Stat>
          <Stat title="Done tasks" value={1502}>
            <IconContext.Provider value={{ size: "6rem" }}>
              <LuClipboardCheck />
            </IconContext.Provider>
          </Stat>
        </div>
      </>
    )
  } else {
    return (
      <h1>You are not logged in!</h1>
    )
  }
}
