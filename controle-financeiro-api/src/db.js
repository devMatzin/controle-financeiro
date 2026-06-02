require("dotenv").config();

const authMode = process.env.DB_AUTH_MODE || "windows";

let sql;
let config;

if (authMode === "sql") {
  sql = require("mssql");

  config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate:
        process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
    },
  };
} else {
  sql = require("mssql/msnodesqlv8");

  const odbcDriver = process.env.DB_ODBC_DRIVER || "ODBC Driver 18 for SQL Server";

  const connectionString = [
    `Driver={${odbcDriver}}`,
    `Server=${process.env.DB_SERVER}`,
    `Database=${process.env.DB_DATABASE}`,
    "Trusted_Connection=Yes",
    `TrustServerCertificate=${
      process.env.DB_TRUST_SERVER_CERTIFICATE === "true" ? "Yes" : "No"
    }`,
  ].join(";");

  config = {
    connectionString,
  };
}

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }

  return pool;
}

module.exports = {
  sql,
  getPool,
};