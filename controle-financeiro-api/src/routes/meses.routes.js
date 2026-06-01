const express = require("express");
const router = express.Router();

const {
  listMesesFinanceiros,
  createMesFinanceiro,
} = require("../controllers/meses.controller");

router.get("/", listMesesFinanceiros);
router.post("/", createMesFinanceiro);

module.exports = router;
