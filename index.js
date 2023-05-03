import sequelize from "./database/database.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js"

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routing
app.use('/api/user', userRoutes);

// Start Server
const PORT = process.env.PORT || 4000;
    
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  };
};

startServer();