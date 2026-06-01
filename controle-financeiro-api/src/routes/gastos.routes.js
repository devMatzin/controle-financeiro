const express = require("express");
const router = express.Router();

const {
  createGasto,
  updateGasto,
  deleteGasto,
} = require("../controllers/gastos.controller");

router.post("/", createGasto);
router.put("/:id", updateGasto);
router.delete("/:id", deleteGasto);

module.exports = router;