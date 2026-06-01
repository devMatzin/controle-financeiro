const { getPool, sql } = require("../db");
const { sendHttpError } = require("../utils/httpError");

function isValidMonth(monthKey) {
  return /^\d{4}-\d{2}$/.test(String(monthKey || ""));
}

async function createContaFixa(req, res) {
  try {
    const { nome, categoria, valor, diaVencimento } = req.body;

    if (!nome || !String(nome).trim()) {
      return res.status(400).json({
        error: "Informe o nome da conta fixa.",
      });
    }

    if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0) {
      return res.status(400).json({
        error: "Informe um valor vÃ¡lido.",
      });
    }

    if (!diaVencimento || diaVencimento < 1 || diaVencimento > 31) {
      return res.status(400).json({
        error: "Informe um dia de vencimento entre 1 e 31.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Nome", sql.VarChar(100), String(nome).trim())
      .input("Categoria", sql.VarChar(50), String(categoria ?? "").trim())
      .input("Valor", sql.Decimal(18, 2), valor)
      .input("DiaVencimento", sql.Int, diaVencimento)
      .query(`
        INSERT INTO dbo.ContaFixa (
          Nome,
          Categoria,
          Valor,
          DiaVencimento,
          Ativo
        )
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.Nome AS name,
          INSERTED.Categoria AS category,
          INSERTED.Valor AS amount,
          INSERTED.DiaVencimento AS dueDay,
          CAST(0 AS BIT) AS paid
        VALUES (
          @Nome,
          @Categoria,
          @Valor,
          @DiaVencimento,
          1
        );
      `);

    return res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao processar conta fixa.");
  }
}

async function updateContaFixa(req, res) {
  try {
    const id = Number(req.params.id);
    const { nome, categoria, valor, diaVencimento } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Informe a conta fixa.",
      });
    }

    if (!nome || !String(nome).trim()) {
      return res.status(400).json({
        error: "Informe o nome da conta fixa.",
      });
    }

    if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0) {
      return res.status(400).json({
        error: "Informe um valor vÃ¡lido.",
      });
    }

    if (!diaVencimento || diaVencimento < 1 || diaVencimento > 31) {
      return res.status(400).json({
        error: "Informe um dia de vencimento entre 1 e 31.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .input("Nome", sql.VarChar(100), String(nome).trim())
      .input("Categoria", sql.VarChar(50), String(categoria ?? "").trim())
      .input("Valor", sql.Decimal(18, 2), valor)
      .input("DiaVencimento", sql.Int, diaVencimento)
      .query(`
        UPDATE dbo.ContaFixa
        SET
          Nome = @Nome,
          Categoria = @Categoria,
          Valor = @Valor,
          DiaVencimento = @DiaVencimento
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.Nome AS name,
          INSERTED.Categoria AS category,
          INSERTED.Valor AS amount,
          INSERTED.DiaVencimento AS dueDay
        WHERE Id = @Id
          AND Ativo = 1;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: "Conta fixa nÃ£o encontrada.",
      });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao processar conta fixa.");
  }
}

async function deleteContaFixa(req, res) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Informe a conta fixa.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .query(`
        UPDATE dbo.ContaFixa
        SET Ativo = 0
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.Nome AS name,
          INSERTED.Categoria AS category,
          INSERTED.Valor AS amount,
          INSERTED.DiaVencimento AS dueDay,
          CAST(INSERTED.Ativo AS BIT) AS active
        WHERE Id = @Id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: "Conta fixa nÃ£o encontrada.",
      });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao processar conta fixa.");
  }
}

async function updateContaFixaStatus(req, res) {
  try {
    const idContaFixa = Number(req.params.id);
    const { mesReferencia, pago } = req.body;

    if (!idContaFixa) {
      return res.status(400).json({
        error: "Informe a conta fixa.",
      });
    }

    if (!isValidMonth(mesReferencia)) {
      return res.status(400).json({
        error: "Informe o mÃªs no formato YYYY-MM.",
      });
    }

    const isPaid = Boolean(pago);

    const pool = await getPool();

    const result = await pool
      .request()
      .input("IdContaFixa", sql.Int, idContaFixa)
      .input("MesReferencia", sql.Char(7), mesReferencia)
      .input("Pago", sql.Bit, isPaid)
      .query(`
        MERGE dbo.ContaFixaStatusMes AS target
        USING (
          SELECT
            @IdContaFixa AS IdContaFixa,
            @MesReferencia AS MesReferencia
        ) AS source
        ON target.IdContaFixa = source.IdContaFixa
           AND target.MesReferencia = source.MesReferencia

        WHEN MATCHED THEN
          UPDATE SET
            Pago = @Pago,
            DataPagamento = CASE
              WHEN @Pago = 1 THEN SYSDATETIME()
              ELSE NULL
            END

        WHEN NOT MATCHED THEN
          INSERT (
            IdContaFixa,
            MesReferencia,
            Pago,
            DataPagamento
          )
          VALUES (
            @IdContaFixa,
            @MesReferencia,
            @Pago,
            CASE
              WHEN @Pago = 1 THEN SYSDATETIME()
              ELSE NULL
            END
          )

        OUTPUT
          INSERTED.Id AS id,
          INSERTED.IdContaFixa AS fixedBillId,
          INSERTED.MesReferencia AS monthKey,
          CAST(INSERTED.Pago AS BIT) AS paid,
          INSERTED.DataPagamento AS paidAt;
      `);

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao processar conta fixa.");
  }
}

module.exports = {
  createContaFixa,
  updateContaFixa,
  deleteContaFixa,
  updateContaFixaStatus,
};


