import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Project from "./Project.js";

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('name', value.trim())
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('description', value.trim())
    }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Date.now()
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Mid', 'High'),
    allowNull: false,
    validate:{
      isIn: [['Low', 'Mid', 'High']]
    }
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: 'id'
    }
  }
}, {
  timestamps: true
});

Task.belongsTo(Project, {
  foreignKey: 'projectId'
});

export default Task;