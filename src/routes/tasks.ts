import { Router } from "express";
import Tasks from "../entity/tasks";

const router = Router();

router.get("/tasks", async (req, res) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  const tasks = await Tasks.find({ where: { user: { id: req.user.id } } });
  
  res.status(200).json(tasks);
});

router.post("/task", async (req, res) => {
  const { title, description, isDone } = req.body;

  const user = req.user;
  if (!user) {
    res.sendStatus(401);
    return;
  }
  const task = Tasks.create({
    title,
    description,
    is_done: isDone,
    user: req.user
  });

  await task.save();

  res.status(200).json(task);
});
  
router.route("/tasks/:taskId")
  .get(async (req, res) => {
    const { taskId } = req.params;
    const task = await Tasks.findOne({ where: { id: +taskId, user: { id: req.user?.id } } });
    if (!task) {
      res.sendStatus(404);
      return;
    }

    res.status(200).json(task);
  })
  .put(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, isDone } = req.body;
    const task = await Tasks.findOne({ where: { id: +taskId }, relations: ["user"] });
    if (!task) {
      res.sendStatus(404);
      return;
    }
    if (!req.user || req.user.id !== task.user.id) {
      res.sendStatus(401);
      return;
    }

    title && (task.title = title);
    description && (task.description = description);
    task.is_done = isDone;

    await task.save();

    res.status(200).json(task);
  })
  .delete(async (req, res) => {
    const { taskId } = req.params;
    const task = await Tasks.findOne({ where: { id: +taskId }, relations: ["user"] });
    if (!task) {
      res.sendStatus(404);
      return;
    }
    if (!req.user || req.user.id !== task.user.id) {
      res.sendStatus(401);
      return;
    }

    await task.remove();

    res.sendStatus(204);
  });

export default router;
