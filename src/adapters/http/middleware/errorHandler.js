/**
 * Global Error Handler for unhandled exceptions
 */
const errorHandler = (err, req, res, next) => {
  // Fallback to console if the container failed to attach for some reason
  const logger = req.container ? req.container.resolve('logger') : console;

  logger.error('Unhandled Exception Caught', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  // Strict JSend format for server errors
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

export default errorHandler;