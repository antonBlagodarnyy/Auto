import express from "express";

const router = express.Router();
import * as ClientController from "../controllers/clients.js";
import { authMiddleware } from "../middleware/auth.js";

router.post("/create", authMiddleware, ClientController.createClient);
router.get("/get", authMiddleware, ClientController.getClients);
router.delete("/delete", authMiddleware, ClientController.deleteClient);
router.put("/update", authMiddleware, ClientController.updateClient);

export default router;
