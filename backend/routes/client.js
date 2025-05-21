const express = require("express");

const router = express.Router();
const ClientController = require("../controllers/clients");
const authMiddleware = require("../middleware/auth.js");

router.post("/create", authMiddleware, ClientController.createClient);
router.get("/get", authMiddleware, ClientController.getClients);
router.delete("/delete", authMiddleware, ClientController.deleteClient);
router.put("/update", authMiddleware, ClientController.updateClient);

module.exports = router;