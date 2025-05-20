const express = require("express");

const router = express.Router();
const ClientController = require("../controllers/clients");

router.post("/create", ClientController.createClient);
router.get("/get", ClientController.getClients);
router.delete("/delete", ClientController.deleteClient);
router.put("/update", ClientController.updateClient);

module.exports = router;