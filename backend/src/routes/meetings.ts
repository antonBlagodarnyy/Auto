import express from "express";

const router = express.Router();
import * as MeetingsController from "../controllers/meetings.js";
import { authMiddleware } from "../middleware/auth.js";

router.post("/create", authMiddleware, MeetingsController.createMeeting);
router.get("/get", authMiddleware, MeetingsController.getMeetings);
router.delete("/delete", authMiddleware, MeetingsController.deleteMeeting);
router.put("/update", authMiddleware, MeetingsController.updateMeeting);

export default  router;
