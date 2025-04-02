import { Router, Request, Response, NextFunction } from "express";
import Projects from "../entity/projects";
import { validate } from "class-validator";
import ValidationError from "../errors/ValidationError";
import NotFoundError from "../errors/NotFoundError";

const router = Router();
const getProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const project = await Projects.findOneBy({ id: +projectId, user: { id: req.user?.id }});
    if (!project) {
      throw new NotFoundError({ message: `Task with ID ${projectId} not found.`, statusCode: 404 });
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
}

router.get("/projects", async (req, res, next) => {
  try {
    const projects = await Projects.findBy({ user: { id: req.user?.id }});

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
});

router.post("/project", async (req, res, next) => {
  try {
    const { title, isDone } = req.body;

    const project = Projects.create({
      title,
      is_done: isDone,
      user: req.user
    });

    const validationErrors = await validate(project, { skipMissingProperties: true });
    if (validationErrors.length) {
      throw new ValidationError({ message: "Validation failed.", statusCode: 422, validationErrors });
    }

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
});

router.route("/projects/:projectId")
  .get(getProject, async (req, res, next) => {
    try {
      res.status(200).json(req.project);
    } catch (error) {
      next(error);
    }
  })
  .put(getProject, async (req, res, next) => {
    try {
      const project = req.project!;
      const { title, isDone } = req.body;

      title && (project.title = title);
      isDone && (project.is_done = isDone);
      
      const validationErrors = await validate(project, { skipMissingProperties: true });
      if (validationErrors.length) {
        throw new ValidationError({ message: "Validation failed.", statusCode: 422, validationErrors });
      }

      await project.save();

      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  })
  .delete(getProject, async (req, res, next) => {
    try {
      const project = req.project!;

      await project.remove();

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

export default router;
