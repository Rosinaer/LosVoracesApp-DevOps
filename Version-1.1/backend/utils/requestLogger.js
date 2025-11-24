const winston = require("winston");
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");

// Detectar entorno
const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

// Cliente Logtail
const logtailToken = process.env.LOGTAIL_SOURCE_TOKEN || null;
const logtail = logtailToken ? new Logtail(logtailToken) : null;

const transports = [];

if (!isTest) {
  transports.push(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Archivo local
if (!isProduction && !isTest) {
  transports.push(
    new winston.transports.File({
      filename: "logs/app.log",
      level: "info",
      maxsize: 1000000,
      maxFiles: 3,
    })
  );
}

// Logtail
if (isProduction && logtail) {
  transports.push(new LogtailTransport(logtail));
}

// Crear logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports,
});

export function requestLogger(req, res, next) {
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


export async function logEvent(event, details = {}) {
  logger.info({
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });

  if (logtail && isProduction) {
    await logtail.flush();
  }
}

export default logger;
