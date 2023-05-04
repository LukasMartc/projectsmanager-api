import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import User from "./User.js";

export const Project = sequelize.define('Project', {
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
  deadline: {
    type: DataTypes.DATE,
    defaultValue: Date.now()
  },
  client: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('client', value.trim())
    }
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  collaborators: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true,
    defaultValue: []
  }
}, {
  timestamps: true
});

Project.belongsTo(User, {
  as: 'creator',
  foreignKey: 'creatorId'
});

export default Project;