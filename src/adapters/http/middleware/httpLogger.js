/**
 * Global HTTP Traffic Logger
 * @param {Object} logger - The logger service resolved from the DI container
 */
const httpLogger = (logger) => (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info('HTTP Traffic', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress
    });
  });

  next();
};

export default httpLogger;