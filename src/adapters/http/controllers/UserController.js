class UserController {
  #getProfileUseCase;

  constructor({ getProfileUseCase}) {
    this.#getProfileUseCase = getProfileUseCase;

    this.getProfile = this.getProfile.bind(this);
  }

  async getProfile(req, res, next) {
    const result = await this.#getProfileUseCase.execute({  userId: req.user.userId });

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
  }
}

export default UserController;