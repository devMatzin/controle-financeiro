require("dotenv").config();

const sql = require("mssql");

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 1433),

  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate:
      process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
  },

  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 60000,
  },

  connectionTimeout: 60000,
  requestTimeout: 60000,
};

let poolPromise = null;

async function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        console.log("[DB] Pool conectado com sucesso");

        pool.on("error", async (error) => {
          console.error("[DB] Erro no pool:", error.message);
          poolPromise = null;

          try {
            await pool.close();
          } catch {
            // ignora erro ao fechar pool quebrado
          }
        });

        return pool;
      })
      .catch((error) => {
        console.error("[DB] Erro ao conectar:", error.message);
        poolPromise = null;
        throw error;
      });
  }

  return poolPromise;
}

module.exports = {
  sql,
  getPool,
};