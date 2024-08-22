import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoryController";
import { validateToken } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/search", validateToken, getCategories);
router.get("/:id", validateToken, getCategoryById);
router.post("/", validateToken, createCategory);
router.put("/:id", validateToken, updateCategory);
router.delete("/:id", validateToken, deleteCategory);

export default router;
