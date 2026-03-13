class LoggerService {
  info(message, meta = {}) {
    throw new Error("LOGGER_SERVICE.INFO.METHOD_NOT_IMPLEMENTED");
  }

  error(message, meta = {}) {
    throw new Error("LOGGER_SERVICE.ERROR.METHOD_NOT_IMPLEMENTED");
  }

  warn(message, meta = {}) {
    throw new Error("LOGGER_SERVICE.WARN.METHOD_NOT_IMPLEMENTED");
  }

  debug(message, meta = {}) {
    throw new Error("LOGGER_SERVICE.DEBUG.METHOD_NOT_IMPLEMENTED");
  }
}

export default LoggerService;