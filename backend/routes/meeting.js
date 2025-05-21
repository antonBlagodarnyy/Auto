const express = require("express");

const router = express.Router();
const MeetingController = require("../controllers/meeting");

router.post("/create", MeetingController.createMeeting);
router.get("/get", MeetingController.getMeetings);


module.exports = router;
