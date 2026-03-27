class ThreadController {
  #getAllThreadUseCase;

  constructor({ getAllThreadUseCase}) {
    this.#getAllThreadUseCase = getAllThreadUseCase;

    this.getAllThread = this.getAllThread.bind(this);
  }

  async getAllThread(req, res, next) {
    try {
      const result = await this.#getAllThreadUseCase.execute();

      if (result.isFailure) {
        return res.status(400).json({
          status: "fail",
          data: { message: result.error }
        });
      }

      return res.status(200).json({
        status: "success",
        data: { threads: result.getValue() }
      })
    } catch (error) {
      next(error);
    }
  }
}

export default ThreadController;