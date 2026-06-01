const express = require("express");
const router = express.Router();

const {
  updateSalario,
} = require("../controllers/salario.controller");

router.put("/", updateSalario);

module.exports = router;