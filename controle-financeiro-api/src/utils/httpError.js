const isProduction = process.env.NODE_ENV === "production";

function sendHttpError(res, error, fallbackMessage, statusCode = 500) {
  const payload = {
    error:
      statusCode >= 500
        ? "Erro interno no servidor."
        : fallbackMessage || "Erro na requisição.",
  };

  if (!isProduction && error?.message) {
    payload.details = error.message;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  sendHttpError,
};
