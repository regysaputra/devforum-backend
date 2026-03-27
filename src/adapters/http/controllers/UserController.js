class UserController {
  #getProfileUseCase;

  constructor({ getProfileUseCase}) {
    this.#getProfileUseCase = getProfileUseCase;

    this.getProfile = this.getProfile.bind(this);
  }

  async getProfile(req, res, next) {
    try {
      const result = await this.#getProfileUseCase.execute({  userId: req.user.userId });
      console.log("result : ", result);
      if (result.isFailure) {
        return res.status(400).json({
          status: "fail",
          data: { message: result.error }
        });
      }

      return res.status(200).json({
        status: "success",
        data: { user: result.getValue() }
      })
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;