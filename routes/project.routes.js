import express from "express";
import {
  getAllProjects,
  crateProject,
  getProject,
  updateProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  getAllTasks
} from "../controllers/project.controllers.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/')
  .get(checkAuth, getAllProjects)
  .post(checkAuth, crateProject);

router.route('/:id')
  .get(checkAuth, getProject)
  .put(checkAuth, updateProject)
  .delete(checkAuth, deleteProject);

router.route('/:id/colaborator')
  .post(checkAuth, addCollaborator)
  .delete(checkAuth, deleteCollaborator);

router.get('/:id/tasks', checkAuth, getAllTasks);

export default router;