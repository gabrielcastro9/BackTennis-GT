import { Router } from "express";
import {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/UserController";
import { validateToken } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/:id", validateToken, getUserById);
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/:id", validateToken, updateUser); 
router.delete("/:id", validateToken, deleteUser); 

export default router;
