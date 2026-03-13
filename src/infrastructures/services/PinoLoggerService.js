import pino from "pino";
import LoggerService from "../../applications/interfaces/LoggerService.js";

class PinoLoggerService extends LoggerService {
  #logger;

  constructor() {
    super();
    this.#logger = pino({
      level: 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
    })
  }

  info(message, meta = {}) {
    this.#logger.info(meta, message);
  }

  error(message, meta = {}) {
    this.#logger.error(meta, message);
  }

  warn(message, meta = {}) {
    this.#logger.warn(meta, message);
  }

  debug(message, meta = {}) {
    this.#logger.debug(meta, message);
  }
}

export default PinoLoggerService;