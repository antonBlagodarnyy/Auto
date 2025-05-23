const express = require("express");

const router = express.Router();
const MeetingController = require("../controllers/meeting");
const authMiddleware = require("../middleware/auth.js");

router.post("/create", authMiddleware, MeetingController.createMeeting);
router.get("/get", authMiddleware, MeetingController.getMeetings);
router.delete("/delete", authMiddleware, MeetingController.deleteMeeting);
router.put("/update", authMiddleware, MeetingController.updateMeeting);

module.exports = router;
