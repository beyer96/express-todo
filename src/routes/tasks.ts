import { Router, Request, Response, NextFunction } from "express";
import Tasks from "../entity/tasks";

const router = Router();
const getTask = async (req: Request, res: Response, next: NextFunction) => {
  const { taskId } = req.params;
  const task = await Tasks.findOneBy({ id: +taskId, user: { id: req.user?.id }});
  if (!task) {
    res.sendStatus(404);
    return;
  }

  req.task = task;
  next();
};

router.get("/tasks", async (req, res) => {
  const tasks = await Tasks.find({ where: { user: { id: req.user?.id } } });
  
  res.status(200).json(tasks);
});

router.post("/task", async (req, res) => {
  const { title, description, isDone } = req.body;

  const user = req.user;
  const task = Tasks.create({
    title,
    description,
    is_done: isDone,
    user
  });

  await task.save();

  res.status(200).json(task);
});
  
router.route("/tasks/:taskId")
  .get(getTask, async (req, res) => {
    res.status(200).json(req.task);
  })
  .put(getTask, async (req, res) => {
    const task = req.task!;
    const { title, description, isDone } = req.body;

    title && (task.title = title);
    description && (task.description = description);
    typeof isDone === "boolean" && (task.is_done = isDone);

    await task.save();

    res.status(200).json(task);
  })
  .delete(getTask, async (req, res) => {
    const task = req.task!;

    await task.remove();

    res.sendStatus(204);
  });

export default router;
