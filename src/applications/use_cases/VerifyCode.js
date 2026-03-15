import Result from "../../shared/core/Result.js";

class VerifyCode {
  #hashService;
  #verificationCodeRepository;
  #tokenService;
  #logger;

  constructor({ hashService, verificationCodeRepository, tokenService, logger }) {
    this.#hashService = hashService;
    this.#verificationCodeRepository = verificationCodeRepository;
    this.#tokenService = tokenService;
    this.#logger = logger;
  }

  async execute(payload) {
    try {
      const result = await this.#verificationCodeRepository.findByIdentifier(payload.identifier);

      console.log("result :", result);

      if (!result) {
        return Result.fail("invalid or expired verification code");
      }

      // check expiration time
      console.log("result.expiresAt :", result.expiresAt);
      console.log("isExpired  :", new Date() > result.expiresAt);
      if (new Date() > result.expiresAt) {
        return Result.fail("invalid or expired verification code");
      }

      const isValid = await this.#hashService.compare(payload.code, result.codeHash);
      console.log("isValid :", isValid);
      if (!isValid) {
        return Result.fail("invalid or expired verification code");
      }

      const jwtToken = this.#tokenService.generate({ identifier: result.identifier });  // expire in 30 minutes

      return Result.ok(jwtToken);
    } catch (error) {
      this.#logger.error('Failed to verify code', {
        identifier: payload.identifier,
        error: error.message,
        stack: error.stack
      });

      return Result.fail(error.message);
    }
  }
}

export default VerifyCode;