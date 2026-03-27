import Result from "../../shared/core/Result.js";


class GetProfile {
  #userRepository;
  #logger;

  constructor({ logger, userRepository }) {
    this.#logger = logger;
    this.#userRepository = userRepository;
  }

  async execute(payload) {
    try {
      console.log("GET PROFILE payload: ", payload);
      // Find user in db
      const result = await this.#userRepository.findById(payload.userId);

      if (!result) {
        return Result.fail("User not found");
      }

      return Result.ok({
        id: result.id,
        fullName: result.fullName,
        username: result.username,
        email: result.email,
        phoneNumber: result.phone_number,
      });
    } catch (error) {
      this.#logger.error('Failed to get profile', {
        error: error.message,
        stack: error.stack
      });

      return Result.fail(error.message);
    }
  }
}

export default GetProfile;