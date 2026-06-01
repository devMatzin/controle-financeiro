const { getPool, sql } = require("../db");
const { sendHttpError } = require("../utils/httpError");

function isValidMonth(monthKey) {
  return /^\d{4}-\d{2}$/.test(String(monthKey || ""));
}

function isValidNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

async function updateBaseParcela(req, res) {
  try {
    const idCartao = Number(req.params.id);
    const { mesReferencia, descricao, valor } = req.body;

    if (!idCartao) {
      return res.status(400).json({ error: "Informe o cartÃ£o." });
    }

    if (!isValidMonth(mesReferencia)) {
      return res.status(400).json({
        error: "Informe o mÃªs no formato YYYY-MM.",
      });
    }

    if (!isValidNumber(valor) || valor < 0) {
      return res.status(400).json({
        error: "Informe um valor vÃ¡lido.",
      });
    }

    const pool = await getPool();

    // Regra:
    // valor = 0 remove a base/parcelas do mÃªs
    if (valor === 0) {
      await pool
        .request()
        .input("IdCartao", sql.Int, idCartao)
        .input("MesReferencia", sql.Char(7), mesReferencia)
        .query(`
          DELETE FROM dbo.CartaoBaseParcela
          WHERE IdCartao = @IdCartao
            AND MesReferencia = @MesReferencia;
        `);

      return res.json({
        idCartao,
        mesReferencia,
        descricao: descricao || "Parcelas em andamento",
        valor: 0,
        removed: true,
      });
    }

    // Para manter apenas um valor base por cartÃ£o/mÃªs:
    // apaga o anterior e insere o novo.
    await pool
      .request()
      .input("IdCartao", sql.Int, idCartao)
      .input("MesReferencia", sql.Char(7), mesReferencia)
      .query(`
        DELETE FROM dbo.CartaoBaseParcela
        WHERE IdCartao = @IdCartao
          AND MesReferencia = @MesReferencia;
      `);

    const result = await pool
      .request()
      .input("IdCartao", sql.Int, idCartao)
      .input("MesReferencia", sql.Char(7), mesReferencia)
      .input("Descricao", sql.VarChar(200), descricao || "Parcelas em andamento")
      .input("Valor", sql.Decimal(18, 2), valor)
      .query(`
        INSERT INTO dbo.CartaoBaseParcela (
          IdCartao,
          MesReferencia,
          Descricao,
          Valor
        )
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.IdCartao AS cardId,
          INSERTED.MesReferencia AS monthKey,
          INSERTED.Descricao AS description,
          INSERTED.Valor AS amount
        VALUES (
          @IdCartao,
          @MesReferencia,
          @Descricao,
          @Valor
        );
      `);

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao processar cartão.");
  }
}

async function updateCartaoStatus(req, res) {
  try {
    const idCartao = Number(req.params.id);
    const { mesReferencia, pago } = req.body;

    if (!idCartao) {
      return res.status(400).json({
        error: "Informe o cartÃ£o.",
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
      .input("IdCartao", sql.Int, idCartao)
      .input("MesReferencia", sql.Char(7), mesReferencia)
      .input("Pago", sql.Bit, isPaid)
      .query(`
        MERGE dbo.CartaoStatusMes AS target
        USING (
          SELECT
            @IdCartao AS IdCartao,
            @MesReferencia AS MesReferencia
        ) AS source
        ON target.IdCartao = source.IdCartao
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
            IdCartao,
            MesReferencia,
            Pago,
            DataPagamento
          )
          VALUES (
            @IdCartao,
            @MesReferencia,
            @Pago,
            CASE
              WHEN @Pago = 1 THEN SYSDATETIME()
              ELSE NULL
            END
          )

        OUTPUT
          INSERTED.Id AS id,
          INSERTED.IdCartao AS cardId,
          INSERTED.MesReferencia AS monthKey,
          CAST(INSERTED.Pago AS BIT) AS paid,
          INSERTED.DataPagamento AS paidAt;
      `);

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao processar cartão.");
  }
}

module.exports = {
  updateBaseParcela,
  updateCartaoStatus,
};

