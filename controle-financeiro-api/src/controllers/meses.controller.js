const { getPool, sql } = require("../db");
const { sendHttpError } = require("../utils/httpError");

function isValidMonth(monthKey) {
  return /^\d{4}-\d{2}$/.test(String(monthKey || ""));
}

function getCurrentMonthKey() {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
    }).formatToParts(new Date());
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;

    if (year && month) {
      return `${year}-${month}`;
    }
  } catch {
    // Fallback para ambientes sem suporte completo a IANA time zones.
  }

  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function isPastMonth(monthKey) {
  return isValidMonth(monthKey) && monthKey < getCurrentMonthKey();
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
      .input("MesReferencia", sql.Char(7), mesReferencia).query(`
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

async function deleteMesFinanceiro(req, res) {
  const mesReferencia = String(req.params.mesReferencia || "").trim();

  if (!isValidMonth(mesReferencia)) {
    return res.status(400).json({
      error: "Informe o mes no formato YYYY-MM.",
    });
  }

  if (!isPastMonth(mesReferencia)) {
    return res.status(400).json({
      error: "Somente meses anteriores ao mes atual podem ser excluidos.",
    });
  }

  let transaction = null;
  let transactionStarted = false;

  try {
    const pool = await getPool();
    transaction = new sql.Transaction(pool);

    await transaction.begin();
    transactionStarted = true;

    const result = await new sql.Request(transaction).input(
      "MesReferencia",
      sql.Char(7),
      mesReferencia,
    ).query(`
        DECLARE
          @GastosMes INT = 0,
          @CartaoBaseParcela INT = 0,
          @CartaoStatusMes INT = 0,
          @ContaFixaStatusMes INT = 0,
          @SalarioMes INT = 0,
          @MesFinanceiro INT = 0;

        DELETE FROM dbo.GastoMes
        WHERE MesReferencia = @MesReferencia;
        SET @GastosMes = @@ROWCOUNT;

        DELETE FROM dbo.CartaoBaseParcela
        WHERE MesReferencia = @MesReferencia;
        SET @CartaoBaseParcela = @@ROWCOUNT;

        DELETE FROM dbo.CartaoStatusMes
        WHERE MesReferencia = @MesReferencia;
        SET @CartaoStatusMes = @@ROWCOUNT;

        DELETE FROM dbo.ContaFixaStatusMes
        WHERE MesReferencia = @MesReferencia;
        SET @ContaFixaStatusMes = @@ROWCOUNT;

        DELETE FROM dbo.SalarioMes
        WHERE MesReferencia = @MesReferencia;
        SET @SalarioMes = @@ROWCOUNT;

        DELETE FROM dbo.MesFinanceiro
        WHERE MesReferencia = @MesReferencia;
        SET @MesFinanceiro = @@ROWCOUNT;

        SELECT
          @GastosMes AS expenses,
          @CartaoBaseParcela AS cardBaseCharges,
          @CartaoStatusMes AS cardStatuses,
          @ContaFixaStatusMes AS fixedBillStatuses,
          @SalarioMes AS salaries,
          @MesFinanceiro AS billingMonths;
      `);

    await transaction.commit();
    transactionStarted = false;

    return res.json({
      monthKey: mesReferencia,
      removed: true,
      deleted: result.recordset[0],
    });
  } catch (error) {
    if (transactionStarted && transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error("Erro ao desfazer exclusao de mes:", rollbackError);
      }
    }

    console.error(error);
    return sendHttpError(res, error, "Erro ao excluir mes financeiro.");
  }
}

module.exports = {
  listMesesFinanceiros,
  createMesFinanceiro,
  deleteMesFinanceiro,
};
