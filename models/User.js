import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import bcrypt from "bcrypt";

const User = sequelize.define('User', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    isEmail: true,
    set(value) {
      this.setDataValue('email', value.trim())
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('password', value.trim())
    }
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  token: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: DataTypes.UUIDV4
  }
}, {
  timestamps: true
});

User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword
});

User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

export default User;