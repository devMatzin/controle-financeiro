const express = require("express");
const router = express.Router();

const {
  createRecorrente,
  deleteRecorrente,
  updateRecorrenteFatura,
  updateRecorrenteCartao,
  updateRecorrente,
} = require("../controllers/recorrentes.controller");

router.post("/", createRecorrente);
router.put("/:id", updateRecorrente);
router.delete("/:id", deleteRecorrente);
router.patch("/:id/fatura", updateRecorrenteFatura);
router.patch("/:id/cartao", updateRecorrenteCartao);

module.exports = router;