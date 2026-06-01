const { getPool, sql } = require("../db");
const { sendHttpError } = require("../utils/httpError");

function isValidNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

async function createGasto(req, res) {
  try {
    const { idCartao, descricao, valor, dataHora, mesReferencia } = req.body;

    if (!idCartao) {
      return res.status(400).json({ error: "Informe o cartão." });
    }

    if (!isValidNumber(valor) || valor <= 0) {
      return res.status(400).json({ error: "Informe um valor válido." });
    }

    if (!dataHora) {
      return res.status(400).json({ error: "Informe a data/hora." });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("IdCartao", sql.Int, idCartao)
      .input("Descricao", sql.VarChar(200), descricao || "Gasto Mês")
      .input("Valor", sql.Decimal(18, 2), valor)
      .input("DataHora", sql.DateTime2, new Date(dataHora))
      .input("MesReferencia", sql.Char(7), mesReferencia)
      .query(`
        INSERT INTO dbo.GastoMes (
          IdCartao,
          Descricao,
          Valor,
          DataHora,
          MesReferencia
        )
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.IdCartao AS idCartao,
          INSERTED.Descricao AS descricao,
          INSERTED.Valor AS valor,
          INSERTED.DataHora AS dataHora,
          INSERTED.MesReferencia AS mesReferencia
        VALUES (
          @IdCartao,
          @Descricao,
          @Valor,
          @DataHora,
          @MesReferencia
        );
    `);

    return res.status(201).json(result.recordset[0]);
  } catch (error) {
    console.error(error);

    return sendHttpError(res, error, "Erro ao cadastrar gasto.");
  }
}

async function updateGasto(req, res) {
  try {
    const id = Number(req.params.id);
    const { idCartao, descricao, valor, dataHora } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Informe o gasto." });
    }

    if (!idCartao) {
      return res.status(400).json({ error: "Informe o cartão." });
    }

    if (typeof valor !== "number" || !Number.isFinite(valor) || valor <= 0) {
      return res.status(400).json({ error: "Informe um valor válido." });
    }

    if (!dataHora) {
      return res.status(400).json({ error: "Informe a data/hora." });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .input("IdCartao", sql.Int, idCartao)
      .input("Descricao", sql.VarChar(200), descricao || "Gasto Mês")
      .input("Valor", sql.Decimal(18, 2), valor)
      .input("DataHora", sql.DateTime2, new Date(dataHora))
      .query(`
        UPDATE dbo.GastoMes
        SET
          IdCartao = @IdCartao,
          Descricao = @Descricao,
          Valor = @Valor,
          DataHora = @DataHora
        OUTPUT
          INSERTED.Id AS id,
          INSERTED.IdCartao AS idCartao,
          INSERTED.Descricao AS descricao,
          INSERTED.Valor AS valor,
          INSERTED.DataHora AS dataHora
        WHERE Id = @Id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Gasto não encontrado." });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);

    return sendHttpError(res, error, "Erro ao atualizar gasto.");
  }
}

async function deleteGasto(req, res) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Informe o gasto." });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("Id", sql.Int, id)
      .query(`
        DELETE FROM dbo.GastoMes
        OUTPUT
          DELETED.Id AS id,
          DELETED.IdCartao AS idCartao,
          DELETED.Descricao AS descricao,
          DELETED.Valor AS valor,
          DELETED.DataHora AS dataHora
        WHERE Id = @Id;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Gasto não encontrado." });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);

    return sendHttpError(res, error, "Erro ao excluir gasto.");
  }
}

module.exports = {
  createGasto,
  updateGasto,
  deleteGasto,
};
