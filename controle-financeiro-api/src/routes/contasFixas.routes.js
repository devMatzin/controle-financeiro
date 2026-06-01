const express = require("express");
const router = express.Router();

const {
  createContaFixa,
  updateContaFixa,
  deleteContaFixa,
  updateContaFixaStatus,
} = require("../controllers/contasFixas.controller");

router.post("/", createContaFixa);
router.put("/:id", updateContaFixa);
router.delete("/:id", deleteContaFixa);
router.patch("/:id/status", updateContaFixaStatus);

module.exports = router;