import express from "express";
import {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  completedTask
} from "../controllers/task.controllers.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post('/', checkAuth,  addTask);

router.route('/:id') 
  .get(checkAuth, getTask)
  .put(checkAuth, updateTask)
  .delete(checkAuth, deleteTask);

router.post('/completed/:id', checkAuth, completedTask);

export default router;