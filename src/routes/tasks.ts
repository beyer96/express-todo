import { Router, Request, Response, NextFunction } from "express";
import Tasks from "../entity/tasks";
import { validate } from "class-validator";
import NotFoundError from "../errors/NotFoundError";
import ValidationError from "../errors/ValidationError";

const router = Router();
const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params;
    const task = await Tasks.findOneBy({ id: +taskId, user: { id: req.user?.id }});
    if (!task) {
      throw new NotFoundError({ message: `Task with ID ${taskId} not found.`, statusCode: 404 });
    }

    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
};

router.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await Tasks.find({
      where: { user: { id: req.user?.id }},
      order: { id: "ASC" }
    });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

router.post("/task", async (req, res, next) => {
  try {
    const { title, description, is_done } = req.body;

    const user = req.user;
    const task = Tasks.create({
      title,
      description,
      is_done,
      user
    });

    const validationErrors = await validate(task, { skipMissingProperties: true });
    if (validationErrors.length) {
      throw new ValidationError({ message: "Validation failed.", statusCode: 422, validationErrors });
    }

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});
  
router.route("/tasks/:taskId")
  .get(getTask, async (req, res, next) => {
    try {
      res.status(200).json(req.task);
    } catch (error) {
      next(error);
    }
  })
  .put(getTask, async (req, res, next) => {
    try {
      const task = req.task!;
      const { title, description, is_done } = req.body;

      title && (task.title = title);
      description && (task.description = description);
      typeof is_done === "boolean" && (task.is_done = is_done);

      const validationErrors = await validate(task, { skipMissingProperties: true });
      if (validationErrors.length) {
        throw new ValidationError({ message: "Validation failed.", statusCode: 422, validationErrors });
      }

      await task.save();

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  })
  .delete(getTask, async (req, res, next) => {
    try {
      const task = req.task!;

      await task.remove();

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

export default router;
