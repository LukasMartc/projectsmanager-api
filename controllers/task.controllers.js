import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { projectId } = req.body;
  const { dataValues } = req.user;

  try {
    const projectExists = await Project.findByPk(projectId);
  
    if(!projectExists || projectExists.creatorId !== dataValues.id) {
      return res.status(404).json({ msg: 'Project does not exists' });
    };
    
    const task = await Task.create(req.body);
    return res.json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failed to add task' });
  };
};

const getTask = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;
  
  try {
    const task = await Task.findOne({
      where: { id },
      include: { model: Project }
    })

    if(!task || task.Project.creatorId !== dataValues.id) {
      return res.status(404).json({ msg: 'Task does not exists' });
    };

    return res.json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failed to get task' });
  };
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;
  
  try {
    const task = await Task.findOne({
      where: { id },
      include: { model: Project }
    })

    if(!task || task.Project.creatorId !== dataValues.id) {
      return res.status(404).json({ msg: 'Task does not exists' });
    };

    task.set(req.body);

    await task.save();

    return res.json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failed to update task' });
  };
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;
  
  try {
    const task = await Task.findOne({
      where: { id },
      include: { model: Project }
    })

    if(!task || task.Project.creatorId !== dataValues.id) {
      return res.status(404).json({ msg: 'Task does not exists' });
    };

    await Task.destroy({
      where: {
        id
      }
    });
    
    return res.json({ msg: 'Task deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failed to delete task' });
  };
};

const completedTask = async (req, res) => {

};

export {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  completedTask
};