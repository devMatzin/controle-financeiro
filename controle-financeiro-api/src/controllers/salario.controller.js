const { getPool, sql } = require("../db");
const { sendHttpError } = require("../utils/httpError");

function isValidMonth(monthKey) {
  return /^\d{4}-\d{2}$/.test(String(monthKey || ""));
}

function isValidNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

async function updateSalario(req, res) {
  try {
    const { mesReferencia, valor } = req.body;

    if (!isValidMonth(mesReferencia)) {
      return res.status(400).json({
        error: "Informe o mÃªs no formato YYYY-MM.",
      });
    }

    if (!isValidNumber(valor) || valor < 0) {
      return res.status(400).json({
        error: "Informe um salÃ¡rio vÃ¡lido.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("MesReferencia", sql.Char(7), mesReferencia)
      .input("Valor", sql.Decimal(18, 2), valor)
      .query(`
        MERGE dbo.SalarioMes AS target
        USING (
          SELECT
            @MesReferencia AS MesReferencia
        ) AS source
        ON target.MesReferencia = source.MesReferencia

        WHEN MATCHED THEN
          UPDATE SET
            Valor = @Valor,
            DataAtualizacao = SYSDATETIME()

        WHEN NOT MATCHED THEN
          INSERT (
            MesReferencia,
            Valor,
            DataAtualizacao
          )
          VALUES (
            @MesReferencia,
            @Valor,
            SYSDATETIME()
          )

        OUTPUT
          INSERTED.Id AS id,
          INSERTED.MesReferencia AS monthKey,
          INSERTED.Valor AS amount,
          INSERTED.DataAtualizacao AS updatedAt;
      `);

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao atualizar salário.");
  }
}

module.exports = {
  updateSalario,
};

