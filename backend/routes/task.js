const express = require("express");

const router = express.Router();
const TaskController = require("../controllers/task");
const authMiddleware = require("../middleware/auth.js");

router.post("/create", authMiddleware,TaskController.createTask);
router.get("/get", authMiddleware,TaskController.getTasks);
router.delete("/delete",authMiddleware,TaskController.deleteTask);
router.put("/check", authMiddleware,TaskController.checkTask);

module.exports = router;
