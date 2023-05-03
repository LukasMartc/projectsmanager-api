import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateJWT = id => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '8hr'
  });
  
  return token;
};

export default generateJWT;