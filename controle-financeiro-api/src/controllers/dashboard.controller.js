const { getPool, sql } = require("../db");
const { sendHttpError } = require("../utils/httpError");

function isValidMonth(monthKey) {
  return /^\d{4}-\d{2}$/.test(String(monthKey || ""));
}

async function getDashboard(req, res) {
  try {
    const mesReferencia = req.query.mes;

    if (!isValidMonth(mesReferencia)) {
      return res.status(400).json({
        error: "Informe o mês no formato YYYY-MM. Exemplo: ?mes=2026-06",
      });
    }

    const pool = await getPool();

    const cardsResult = await pool
      .request()
      .input("MesReferencia", sql.Char(7), mesReferencia)
      .query(`
        SELECT
          c.Id AS id,
          c.Nome AS name,
          c.DiaFechamento AS closeDay,
          c.DiaVencimento AS dueDay,
          CAST(ISNULL(csm.Pago, 0) AS BIT) AS paid,
          c.CorClasse AS tone
        FROM dbo.Cartao c
        LEFT JOIN dbo.CartaoStatusMes csm
          ON csm.IdCartao = c.Id
         AND csm.MesReferencia = @MesReferencia
        WHERE c.Ativo = 1
        ORDER BY c.Id;
      `);

    const cardBaseChargesResult = await pool.request().query(`
      SELECT
        Id AS id,
        IdCartao AS cardId,
        MesReferencia AS monthKey,
        Descricao AS description,
        Valor AS amount
      FROM dbo.CartaoBaseParcela
      ORDER BY MesReferencia DESC, IdCartao;
    `);

    const fixedBillsResult = await pool
      .request()
      .input("MesReferencia", sql.Char(7), mesReferencia)
      .query(`
        SELECT
          cf.Id AS id,
          cf.Nome AS name,
          cf.Valor AS amount,
          cf.DiaVencimento AS dueDay,
          CAST(ISNULL(cfsm.Pago, 0) AS BIT) AS paid,
          cf.Categoria AS category
        FROM dbo.ContaFixa cf
        LEFT JOIN dbo.ContaFixaStatusMes cfsm
          ON cfsm.IdContaFixa = cf.Id
         AND cfsm.MesReferencia = @MesReferencia
        WHERE cf.Ativo = 1
        ORDER BY cf.DiaVencimento, cf.Nome;
      `);

    const subscriptionsResult = await pool.request().query(`
      SELECT
        Id AS id,
        Nome AS name,
        Valor AS amount,
        DiaCobranca AS chargeDay,
        IdCartao AS cardId,
        Categoria AS category,
        CAST(EntraNaFatura AS BIT) AS inInvoice
      FROM dbo.Recorrente
      WHERE Ativo = 1
      ORDER BY DiaCobranca, Nome;
    `);

    const historyResult = await pool
    .request()
    .input("MesReferencia", sql.Char(7), mesReferencia)
    .query(`
      SELECT
        g.Id AS id,
        c.Nome AS cardName,
        g.Descricao AS description,
        CONVERT(VARCHAR(10), g.DataHora, 103) + ' ' + CONVERT(VARCHAR(8), g.DataHora, 108) AS date,
        g.MesReferencia AS monthKey,
        g.Valor AS amount,
        CAST(0 AS DECIMAL(18,2)) AS before,
        CAST(0 AS DECIMAL(18,2)) AS after
      FROM dbo.GastoMes g
      INNER JOIN dbo.Cartao c
        ON c.Id = g.IdCartao
      WHERE g.MesReferencia = @MesReferencia
      ORDER BY g.DataHora DESC, g.Id DESC;
  `);

    const salaryResult = await pool
      .request()
      .input("MesReferencia", sql.Char(7), mesReferencia)
      .query(`
        SELECT TOP 1
          Valor AS salary
        FROM dbo.SalarioMes
        WHERE MesReferencia = @MesReferencia;
      `);
    
    const monthsResult = await pool.request().query(`
      SELECT MesReferencia AS monthKey
      FROM dbo.MesFinanceiro
      WHERE Ativo = 1
      ORDER BY MesReferencia DESC;
    `);

    return res.json({
      monthKey: mesReferencia,
      salary: salaryResult.recordset[0]?.salary || 0,
      cards: cardsResult.recordset,
      cardBaseCharges: cardBaseChargesResult.recordset,
      fixedBills: fixedBillsResult.recordset,
      subscriptions: subscriptionsResult.recordset,
      history: historyResult.recordset,
      billingMonthOptions: monthsResult.recordset.map((item) => item.monthKey),
    });
  } catch (error) {
    console.error(error);

    return sendHttpError(res, error, "Erro ao carregar dashboard.");
  }
}

module.exports = {
  getDashboard,
};
