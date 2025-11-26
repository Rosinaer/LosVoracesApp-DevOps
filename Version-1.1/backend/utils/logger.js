const winston = require('winston');
const { Logtail } = require('@logtail/node');

//Configuración de Logtail
const logtailToken = process.env.LOGTAIL_SOURCE_TOKEN || null;
const logtail = logtailToken ? new Logtail (logtailToken) : null;

// Detectar entorno
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";
const isTest = NODE_ENV === "test";

const { combine, timestamp, printf, colorize } = winston.format;

// Formato de logs
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

// Transportes base
const transports = [];

// Consola para dev
if (!isTest) {
  transports.push(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), myFormat),
    })
  );
}

// Archivo local para dev
if (!isProduction && !isTest) {
  transports.push(
    new winston.transports.File({
      filename: "logs/app.log",
      level: "info",
      maxsize: 1_000_000,
      maxFiles: 3,
    })
  );
}


// Crear logger
const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), myFormat),
  transports,
});

// Silenciar logs durante tests
if (isTest) {
  logger.transports.forEach((t) => (t.silent = true));
}

// Integración con Logtail solo en producción
if (isProduction && logtail) {
  const { LogtailTransport } = require("@logtail/winston");
  logger.add(new LogtailTransport(logtail));
}

// Función para loguear eventos de HTTP en middleware
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      event: "http_request",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ip: req.ip,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
    if (logtail && isProduction) {
      logtail.flush();
    }
  });
  next();
}

// Función para loguear eventos generales
async function logEvent(event, details = {}) {
  logger.info({
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });
  if (logtail && isProduction) {
    await logtail.flush();
  }
}

// Función para debug de errores en desarrollo
function debugError(err, context = "") {
  if (!isProduction) {
    console.error(context, err);
  }
}

module.exports = {
  logger,
  requestLogger,
  logEvent,
  debugError,
};