import express from "express";

const router = express.Router();
import * as StoreController from "../controllers/store.js";
import { authMiddleware } from "../middleware/auth.js";

router.post("/create", authMiddleware, StoreController.createProduct);
router.get("/get", authMiddleware, StoreController.getProducts);
router.delete("/delete", authMiddleware, StoreController.deleteProduct);
router.put("/update", authMiddleware, StoreController.updateProduct);

export default  router;
