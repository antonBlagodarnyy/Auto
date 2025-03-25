const express = require("express");

const router = express.Router();
const TaskController = require("../controllers/task");

router.post("/create", TaskController.createTask);
router.get("/get", TaskController.getTasks);
router.delete("/delete", TaskController.deleteTask);
router.put("/check", TaskController.checkTask);

module.exports = router;
