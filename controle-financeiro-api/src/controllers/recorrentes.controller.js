const { getPool, sql } = require("../db");
const { sendHttpError } = require("../utils/httpError");

function isValidNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

async function createRecorrente(req, res) {
  try {
    const {
      nome,
      valor,
      diaCobranca,
      idCartao,
      categoria,
      entraNaFatura,
    } = req.body;

    if (!nome || !String(nome).trim()) {
      return res.status(400).json({
        error: "Informe o nome do recorrente.",
      });
    }

    if (!isValidNumber(valor) || valor < 0) {
      return res.status(400).json({
        error: "Informe um valor vÃ¡lido.",
      });
    }

    if (!diaCobranca || diaCobranca < 1 || diaCobranca > 31) {
      return res.status(400).json({
        error: "Informe um dia de cobranÃ§a entre 1 e 31.",
      });
    }

    const shouldEnterInvoice = Boolean(entraNaFatura);

    if (shouldEnterInvoice && !idCartao) {
      return res.status(400).json({
        error: "Informe o cartÃ£o quando o recorrente entrar na fatura.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Nome", sql.VarChar(100), String(nome).trim())
      .input("Valor", sql.Decimal(18, 2), valor)
      .input("DiaCobranca", sql.Int, diaCobranca)
      .input("IdCartao", sql.Int, shouldEnterInvoice ? idCartao : null)
      .input("Categoria", sql.VarChar(50), categoria || "Streaming")
      .input("EntraNaFatura", sql.Bit, shouldEnterInvoice)
      .query(`
        INSERT INTO dbo.Recorrente (
          Nome,
          Valor,
          DiaCobranca,
          IdCartao,
          Categoria,
          EntraNaFatura,
          Ativo
        )
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.Nome AS name,
          INSERTED.Valor AS amount,
          INSERTED.DiaCobranca AS chargeDay,
          INSERTED.IdCartao AS cardId,
          INSERTED.Categoria AS category,
          CAST(INSERTED.EntraNaFatura AS BIT) AS inInvoice
        VALUES (
          @Nome,
          @Valor,
          @DiaCobranca,
          @IdCartao,
          @Categoria,
          @EntraNaFatura,
          1
        );
      `);

    return res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error(error);

    return sendHttpError(res, error, "Erro ao cadastrar recorrente.");
  }
}

async function deleteRecorrente(req, res) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: "Informe o recorrente.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .query(`
        UPDATE dbo.Recorrente
        SET Ativo = 0
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.Nome AS name,
          INSERTED.Valor AS amount,
          INSERTED.DiaCobranca AS chargeDay,
          INSERTED.IdCartao AS cardId,
          INSERTED.Categoria AS category,
          CAST(INSERTED.EntraNaFatura AS BIT) AS inInvoice,
          CAST(INSERTED.Ativo AS BIT) AS active
        WHERE Id = @Id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: "Recorrente nÃ£o encontrado.",
      });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);

    return sendHttpError(res, error, "Erro ao remover recorrente.");
  }
}

async function updateRecorrenteFatura(req, res) {
  try {
    const id = Number(req.params.id);
    const { entraNaFatura, idCartao } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Informe o recorrente.",
      });
    }

    const shouldEnterInvoice = Boolean(entraNaFatura);

    if (shouldEnterInvoice && !idCartao) {
      return res.status(400).json({
        error: "Informe o cartÃ£o para colocar o recorrente na fatura.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .input("EntraNaFatura", sql.Bit, shouldEnterInvoice)
      .input("IdCartao", sql.Int, shouldEnterInvoice ? Number(idCartao) : null)
      .query(`
        UPDATE dbo.Recorrente
        SET
          EntraNaFatura = @EntraNaFatura,
          IdCartao = @IdCartao
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.Nome AS name,
          INSERTED.Valor AS amount,
          INSERTED.DiaCobranca AS chargeDay,
          INSERTED.IdCartao AS cardId,
          INSERTED.Categoria AS category,
          CAST(INSERTED.EntraNaFatura AS BIT) AS inInvoice,
          CAST(INSERTED.Ativo AS BIT) AS active
        WHERE Id = @Id
          AND Ativo = 1;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: "Recorrente nÃ£o encontrado.",
      });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);

    return sendHttpError(
      res,
      error,
      "Erro ao atualizar fatura do recorrente.",
    );
  }
}

async function updateRecorrenteCartao(req, res) {
  try {
    const id = Number(req.params.id);
    const { idCartao } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Informe o recorrente.",
      });
    }

    if (!idCartao) {
      return res.status(400).json({
        error: "Informe o cartÃ£o.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .input("IdCartao", sql.Int, Number(idCartao))
      .query(`
        UPDATE dbo.Recorrente
        SET
          IdCartao = @IdCartao,
          EntraNaFatura = 1
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.Nome AS name,
          INSERTED.Valor AS amount,
          INSERTED.DiaCobranca AS chargeDay,
          INSERTED.IdCartao AS cardId,
          INSERTED.Categoria AS category,
          CAST(INSERTED.EntraNaFatura AS BIT) AS inInvoice,
          CAST(INSERTED.Ativo AS BIT) AS active
        WHERE Id = @Id
          AND Ativo = 1;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: "Recorrente nÃ£o encontrado.",
      });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao processar recorrente.");
  }
}

async function updateRecorrente(req, res) {
  try {
    const id = Number(req.params.id);

    const {
      nome,
      valor,
      diaCobranca,
      categoria,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Informe o recorrente.",
      });
    }

    if (!nome || !String(nome).trim()) {
      return res.status(400).json({
        error: "Informe o nome do recorrente.",
      });
    }

    if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0) {
      return res.status(400).json({
        error: "Informe um valor vÃ¡lido.",
      });
    }

    if (!diaCobranca || diaCobranca < 1 || diaCobranca > 31) {
      return res.status(400).json({
        error: "Informe um dia de cobranÃ§a entre 1 e 31.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .input("Nome", sql.VarChar(100), String(nome).trim())
      .input("Valor", sql.Decimal(18, 2), valor)
      .input("DiaCobranca", sql.Int, diaCobranca)
      .input("Categoria", sql.VarChar(50), categoria || "Streaming")
      .query(`
        UPDATE dbo.Recorrente
        SET
          Nome = @Nome,
          Valor = @Valor,
          DiaCobranca = @DiaCobranca,
          Categoria = @Categoria
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.Nome AS name,
          INSERTED.Valor AS amount,
          INSERTED.DiaCobranca AS chargeDay,
          INSERTED.IdCartao AS cardId,
          INSERTED.Categoria AS category,
          CAST(INSERTED.EntraNaFatura AS BIT) AS inInvoice,
          CAST(INSERTED.Ativo AS BIT) AS active
        WHERE Id = @Id
          AND Ativo = 1;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: "Recorrente nÃ£o encontrado.",
      });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    return sendHttpError(res, error, "Erro ao processar recorrente.");
  }
}

module.exports = {
  createRecorrente,
  deleteRecorrente,
  updateRecorrenteFatura,
  updateRecorrenteCartao,
  updateRecorrente,
};

