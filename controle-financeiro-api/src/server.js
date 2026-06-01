const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dashboardRoutes = require("./routes/dashboard.routes");
const gastosRoutes = require("./routes/gastos.routes");
const cartoesRoutes = require("./routes/cartoes.routes");
const recorrentesRoutes = require("./routes/recorrentes.routes");
const contasFixasRoutes = require("./routes/contasFixas.routes");
const salarioRoutes = require("./routes/salario.routes");
const mesesRoutes = require("./routes/meses.routes");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const vercelOriginPattern = /\.vercel\.app$/i;
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (defaultAllowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (isProduction && vercelOriginPattern.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
  },
};


const allowedOrigins = new Set(
  String(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

for (const origin of defaultAllowedOrigins) {
  allowedOrigins.add(origin);
}

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.size === 0 ||
        allowedOrigins.has(origin) ||
        vercelOriginPattern.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Origem não permitida pelo CORS."));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "API Controle Financeiro rodando",
  });
});

app.use(cors(corsOptions));
app.use(express.json());


app.use("/api/dashboard", dashboardRoutes);
app.use("/api/gastos", gastosRoutes);
app.use("/api/cartoes", cartoesRoutes);
app.use("/api/recorrentes", recorrentesRoutes);
app.use("/api/contas-fixas", contasFixasRoutes);
app.use("/api/salario", salarioRoutes);
app.use("/api/meses", mesesRoutes);


app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err?.statusCode || err?.status || 500;
  const payload = {
    error:
      statusCode >= 500
        ? "Erro interno no servidor."
        : err?.message || "Erro na requisição.",
  };

  if (!isProduction && err?.message) {
    payload.details = err.message;
  }

  return res.status(statusCode).json(payload);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
