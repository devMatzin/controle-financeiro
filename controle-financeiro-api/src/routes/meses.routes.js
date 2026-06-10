const express = require("express");
const router = express.Router();

const {
  listMesesFinanceiros,
  createMesFinanceiro,
  deleteMesFinanceiro,
} = require("../controllers/meses.controller");

router.get("/", listMesesFinanceiros);
router.post("/", createMesFinanceiro);
router.delete("/:mesReferencia", deleteMesFinanceiro);

module.exports = router;
