import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { Op } from "sequelize";

const getAllProjects = async (req, res) => {
  const { dataValues } = req.user;

  try {
    const projects = await Project.findAll({
      where:{
        [Op.or]: [
          {creatorId: dataValues.id},
          { collaborators: { [Op.contains]: [dataValues.id] } }
        ] 
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
      name: name.toLowerCase(),
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

    if(!project) {
      return res.status(404).json({ msg: 'Project does not exists' });
    };

    if(project.creatorId !== dataValues.id && !project.collaborators.includes(dataValues.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
    }
   
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

    if(!project) {
      return res.status(404).json({ msg: 'Project does not exists' });
    }

    if(project.creatorId !== dataValues.id) {
      return res.status(403).json({ msg: 'Invalid action' });
    }

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

    if(!project) {
      return res.status(404).json({ msg: 'Project does not exists' });
    };

    if(project.creatorId !== dataValues.id) {
      return res.status(403).json({ msg: 'Invalid action' });
    }

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

const searchCollaborator = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email']
    });
  
    if(!user) {
      return res.status(404).json({ msg: 'User not found' });
    };
  
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failted to search user' });
  };
};

const addCollaborator = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;
  const { email } = req.body;

  try {
    const project = await Project.findByPk(id);

    if(!project) {
      return res.status(404).json({ msg: 'Project not found' });
    };

    if(project.creatorId !== dataValues.id) {
      return res.status(403).json({ msg: 'Invalid action' });
    };

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email']
    });
  
    if(!user) {
      return res.status(404).json({ msg: 'User not found' });
    } else if(project.creatorId === user.id) {
      return res.status(404).json({ msg: 'The project creator cannot be a collaborator' });
    }else if(project.collaborators.includes(user.id)) {
      return res.status(404).json({ msg: 'The user already belongs to the project' });
    };

    const newCollaborator = [...project.collaborators, user.id];
    await Project.update({
      collaborators: newCollaborator
    }, {
      where: { id }
    });
    return res.json({ msg: 'Collaborator added successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failted to add collaborator' });
  }
};

const getAllCollaborators = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;

  try {
    const project = await Project.findByPk(id);

    if(!project) {
      return res.status(404).json({ msg: 'Project does not exists' });
    }

    if(project.creatorId !== dataValues.id && !project.collaborators.includes(dataValues.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
    }

    const collaborators = []

    const collaboratorIds = await project.get('collaborators');
    
    for(let collaboratorId of collaboratorIds) {
      const collaborator = await User.findByPk(collaboratorId, {
        attributes: ['id', 'name', 'email']
      });
      collaborators.push(collaborator);
    }
    
    return res.json(collaborators);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failted to get collaborators' });
  }
};

const deleteCollaborator = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;
  const { email } = req.body;

  try {
    const project = await Project.findByPk(id);

    if(!project) {
      return res.status(404).json({ msg: 'Project not found' });
    };

    if(project.creatorId !== dataValues.id) {
      return res.status(403).json({ msg: 'Invalid action' });
    };

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email']
    });
  
    if(!user) {
      return res.status(404).json({ msg: 'User not found' });
    } else if(project.creatorId === user.id) {
      return res.status(404).json({ msg: 'The project creator cannot be removed from collaborators' });
    } else if(!project.collaborators.includes(user.id)) {
      return res.status(404).json({ msg: 'The user is not a collaborator of the project' });
    };

    const newCollaborators = project.collaborators.filter(c => c !== user.id);
    await Project.update({
      collaborators: newCollaborators
    }, {
      where: { id }
    });
    return res.json({ msg: 'Collaborator removed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failted to remove collaborator' });
  };
};

const getAllTasks = async (req, res) => {
  const { id } = req.params;
  const { dataValues } = req.user;

  try {
    const projectExists = await Project.findByPk(id);
  
    if(!projectExists) {
      return res.status(404).json({ msg: 'Project does not exists' });
    }

    if(projectExists.creatorId !== dataValues.id && !projectExists.collaborators.includes(dataValues.id)) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
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
  };
};

const searchProject = async (req, res) => {
  const { name } = req.body;
  const { dataValues } = req.user;

  try {
    if(!name) {
      return res.status(400).json({ msg: 'Project name is required' });
    }

    const projects = await Project.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      }
    });

    if(!projects.length) {
      return res.status(400).json({ msg: 'There are no projects' });
    }

    const hasAccess = projects.every(project => {
      return project.creatorId === dataValues.id || project.collaborators.includes(dataValues.id)
    });

    if(!hasAccess) {
      return res.status(403).json({ msg: 'You do not have access to this project' });
    };
    
    return res.json(projects)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Failed to search project' });
  };
};

export {
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
};