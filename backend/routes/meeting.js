const express = require("express");

const router = express.Router();
const MeetingController = require("../controllers/meeting");
const authMiddleware = require("../middleware/auth.js");

router.post("/create",authMiddleware, MeetingController.createMeeting);
router.get("/get",authMiddleware, MeetingController.getMeetings);


module.exports = router;
