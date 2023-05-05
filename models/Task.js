import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

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
      model: 'Projects',
      key: 'id'
    }
  },
  completedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

export default Task;