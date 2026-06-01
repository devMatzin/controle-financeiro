const express = require("express");
const router = express.Router();

const {
  updateBaseParcela,
  updateCartaoStatus,
} = require("../controllers/cartoes.controller");

router.put("/:id/base-parcelas", updateBaseParcela);
router.patch("/:id/status", updateCartaoStatus);

module.exports = router;