import Result from "../../shared/core/Result.js";

class GetAllThread {
  #logger;
  #threadRepository;

  constructor({ logger, threadRepository }) {
    this.#logger = logger;
    this.#threadRepository = threadRepository;
  }

  async execute() {
    try {
      // Get data from db
      const result = await this.#threadRepository.getAll();

      return Result.ok(result);
    } catch (error) {
      this.#logger.error("Failed to get all threads", {
        error: error.message,
        stack: error.stack
      });

      return Result.fail(error.message);
    }
  }
}

export default GetAllThread;