const express = require("express");
const ptoController = require("../controllers/ptoController");

const router = express.Router();

router.post("/pto-requests", ptoController.submitPTORequest);

module.exports = router;