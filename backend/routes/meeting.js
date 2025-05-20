const express = require("express");

const router = express.Router();
const MeetingController = require("../controllers/meeting");

router.get("/create", MeetingController.createMeeting);


module.exports = router;
