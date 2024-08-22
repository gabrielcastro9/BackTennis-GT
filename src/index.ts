import express from "express";
import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from './routes/productRoutes';

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/category", categoryRoutes);
app.use(productRoutes);

const startServer = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database & tables created!");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
};

startServer();
