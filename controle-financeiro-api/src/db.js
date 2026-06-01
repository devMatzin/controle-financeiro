const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const connectionString = [
  "Driver={ODBC Driver 18 for SQL Server}",
  `Server=${process.env.DB_SERVER}`,
  `Database=${process.env.DB_DATABASE}`,
  "Trusted_Connection=Yes",
  "TrustServerCertificate=Yes",
].join(";");

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect({
      connectionString,
    });
  }

  return pool;
}

module.exports = {
  sql,
  getPool,
};