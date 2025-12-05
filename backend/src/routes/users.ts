import express from "express";

const router = express.Router();
import * as UserController from "../controllers/users.js";

router.post("/signup", UserController.createUser);
router.post("/login", UserController.userLogin);

export default  router;
