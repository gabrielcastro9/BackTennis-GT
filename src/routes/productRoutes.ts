import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController";
import { validateToken } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/product", validateToken, getProducts);
router.get("/product/:id", validateToken, getProductById);
router.post("/product", validateToken, createProduct);
router.put("/product/:id", validateToken, updateProduct);
router.delete("/product/:id", validateToken, deleteProduct);

export default router;
