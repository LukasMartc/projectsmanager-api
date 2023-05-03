import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const checkAuth = async (req, res, next) => {
  const token = req.cookies.tkn;
  try {
    if(!token) {
      return res.status(401).json({ msg: 'Invalid Token' })
    };
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id, { attributes: ['id', 'name', 'email'] });
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'There was an error with user authentication, please try again later' });
  }
}

export default checkAuth