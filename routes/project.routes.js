import express from "express";
import {
  getAllProjects,
  crateProject,
  getProject,
  updateProject,
  deleteProject,
  searchCollaborator,
  addCollaborator,
  getAllCollaborators,
  deleteCollaborator,
  getAllTasks,
  searchProject
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

router.post('/collaborators', checkAuth, searchCollaborator);

router.route('/:id/collaborator')
  .post(checkAuth, addCollaborator)
  .get(checkAuth, getAllCollaborators)
  
router.post('/:id/delete-collaborator', checkAuth, deleteCollaborator);
router.get('/:id/tasks', checkAuth, getAllTasks);
router.post('/search-project', checkAuth, searchProject);

export default router;