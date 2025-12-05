import express from "express";

const router = express.Router();
import * as TaskController from "../controllers/tasks.js";
import { authMiddleware } from "../middleware/auth.js";

router.post("/create", authMiddleware, TaskController.createTask);
router.get("/get", authMiddleware, TaskController.getTasks);
router.delete("/delete", authMiddleware, TaskController.deleteTask);
router.put("/check", authMiddleware, TaskController.checkTask);

export default  router;
