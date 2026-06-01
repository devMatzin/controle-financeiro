const { getPool, sql } = require("../db");
const { sendHttpError } = require("../utils/httpError");

function isValidMonth(monthKey) {
  return /^\d{4}-\d{2}$/.test(String(monthKey || ""));
}

async function listMesesFinanceiros(req, res) {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT MesReferencia AS monthKey
      FROM dbo.MesFinanceiro
      WHERE Ativo = 1
      ORDER BY MesReferencia DESC;
    `);

    return res.json(result.recordset);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao processar meses financeiros.");
  }
}

async function createMesFinanceiro(req, res) {
  try {
    const { mesReferencia } = req.body;

    if (!isValidMonth(mesReferencia)) {
      return res.status(400).json({
        error: "Informe o mÃªs no formato YYYY-MM.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("MesReferencia", sql.Char(7), mesReferencia)
      .query(`
        MERGE dbo.MesFinanceiro AS target
        USING (
          SELECT @MesReferencia AS MesReferencia
        ) AS source
        ON target.MesReferencia = source.MesReferencia

        WHEN MATCHED THEN
          UPDATE SET Ativo = 1

        WHEN NOT MATCHED THEN
          INSERT (MesReferencia, Ativo)
          VALUES (@MesReferencia, 1)

        OUTPUT
          INSERTED.MesReferencia AS monthKey,
          CAST(INSERTED.Ativo AS BIT) AS active;
      `);

    return res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao processar meses financeiros.");
  }
}

module.exports = {
  listMesesFinanceiros,
  createMesFinanceiro,
};


