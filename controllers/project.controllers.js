import Project from "../models/Project.js";
import Task from "../models/Task.js";

const getAllProjects = async (req, res) => {
  const { dataValues } = req.user;

  try {
    const projects = await Project.findAll({
      where:{
        creatorId: dataValues.id
      }
    });
    return res.json(projects);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error getting projects' });
  };
};

const crateProject = async (req, res) => {
  const { name, description, client } = req.body;
  const { dataValues } = req.user;

  try {
    const newProject = await Project.create({
      name, 
      description,
      client,
      creatorId: dataValues.id
    });
    return res.json(newProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error creating project' });
  };
};

const getProject = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;

  try {
    const project = await Project.findByPk(id);

    if(!project || project.creatorId !== dataValues.id) {
      return res.status(404).json({ msg: 'Project does not exists' });
    };
   
    return res.json(project);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error getting project' });
  };
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;

  try {
    const project = await Project.findByPk(id);

    if(!project || project.creatorId !== dataValues.id) {
      return res.status(404).json({ msg: 'Project does not exists' });
    };

    project.set(req.body);

    await project.save();
    
    return res.json(project);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error updating project' });
  };
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;

  try {
    const project = await Project.findByPk(id);

    if(!project || project.creatorId !== dataValues.id) {
      return res.status(404).json({ msg: 'Project does not exists' });
    };

    await Project.destroy({
      where: {
        id
      }
    });
    
    return res.json({ msg: 'Project deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error deleting project' });
  };
};

const addCollaborator = async (req, res) => {

};

const deleteCollaborator = async (req, res) => {

};

const getAllTasks = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;

  try {
    const projectExists = await Project.findByPk(id);
  
    if(!projectExists || projectExists.creatorId !== dataValues.id) {
      return res.status(404).json({ msg: 'Project does not exists' });
    }
  
    const tasks = await Task.findAll({
      where: {
        projectId: id
      }
    });
  
    return res.json(tasks);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error getting Tasks' });
  }

};

export {
  getAllProjects,
  crateProject,
  getProject,
  updateProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator,
  getAllTasks
};