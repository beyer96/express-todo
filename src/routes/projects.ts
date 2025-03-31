import { Router } from "express";
import Projects from "../entity/projects";

const router = Router();

router.get("/projects", async (req, res) => {
  const projects = await Projects.findBy({ user: { id: req.user?.id }});

  res.status(200).json(projects);
});

router.post("/project", async (req, res) => {
  const { title, isDone } = req.body;

  const project = Projects.create({
    title,
    is_done: isDone,
    user: req.user
  });

  await project.save();

  res.status(200).json(project);
});

router.route("/projects/:projectId")
  .get(async (req, res) => {
    const { projectId } = req.params;
    const project = await Projects.findOneBy({ id: +projectId, user: { id: req.user?.id }});
    if (!project) {
      res.sendStatus(404);
      return;
    }

    res.status(200).json(project);
  })
  .put(async (req, res) => {
    const { projectId } = req.params;
    const project = await Projects.findOneBy({ id: +projectId, user: { id: req.user?.id }});
    if (!project) {
      res.sendStatus(404);
      return;
    }

    const { title, isDone } = req.body;

    title && (project.title = title);
    typeof isDone === "boolean" && (project.is_done = isDone);
    
    await project.save();

    res.status(200).json(project);
  })
  .delete(async (req, res) => {
    const { projectId } = req.params;
    const project = await Projects.findOneBy({ id: +projectId, user: { id: req.user?.id }});
    if (!project) {
      res.sendStatus(404);
      return;
    }

    await project.remove();

    res.sendStatus(204);
  });

export default router;
