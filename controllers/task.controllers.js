import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { projectId } = req.body;
  const { dataValues } = req.user;

  try {
    const projectExists = await Project.findByPk(projectId);
  
    if(!projectExists) {
      return res.status(404).json({ msg: 'Project does not exists' });
    };

    if(projectExists.creatorId !== dataValues.id) {
      return res.status(403).json({ msg: 'Invalid action' });
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
    });

    if(!task) {
      return res.status(404).json({ msg: 'Task does not exists' });
    };

    if(task.Project.creatorId !== dataValues.id && !task.Project.collaborators.includes(dataValues.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
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

    if(!task) {
      return res.status(404).json({ msg: 'Task does not exists' });
    };

    if(task.Project.creatorId !== dataValues.id) {
      return res.status(403).json({ msg: 'Invalid action' });
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

    if(!task) {
      return res.status(404).json({ msg: 'Task does not exists' });
    };

    if(task.Project.creatorId !== dataValues.id) {
      return res.status(403).json({ msg: 'Invalid action' });
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
  const { id } = req.params;
  const { dataValues } = req.user;

  try {
    const task = await Task.findOne({
      where: { id },
      include: { model: Project }
    });

    console.log(task)

    if(!task) {
      return res.status(404).json({ msg: 'Task does not exists' });
    };

    if(task.Project.creatorId !== dataValues.id && !task.Project.collaborators.includes(dataValues.id)) {
      return res.status(403).json({ msg: 'Invalid action' });
    };
    
    task.completed = !task.completed;
    task.completedBy = dataValues.id;
    await task.save();

    const storedTask = await Task.findOne({
      where: { id },
      include: [
        { 
          model: Project,
        }, {
          model: User,
          as: 'finishedBy',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    return res.json(storedTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failed to complete task' });
  };
};

export {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  completedTask
};