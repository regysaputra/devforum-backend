import {generateCode} from "../../shared/utils/index.js";
import Result from "../../shared/core/Result.js";
import VerificationCode from "../../domains/VerificationCode.js";

class SendVerificationCode {
  #idGeneratorService;
  #userRepository;
  #verificationCodeRepository;
  #hashService;
  #notificationService;
  #logger;

  constructor({ idGeneratorService, userRepository, verificationCodeRepository, hashService, notificationService, logger }) {
    this.#idGeneratorService = idGeneratorService;
    this.#userRepository = userRepository;
    this.#verificationCodeRepository = verificationCodeRepository;
    this.#hashService = hashService;
    this.#notificationService = notificationService;
    this.#logger = logger;
  }

  async execute(payload) {
    try {
      // Check if a verified user exists with a given identifier
      const isExists = await this.#userRepository.findVerifiedUserByIdentifier(payload.identifier);
      console.log("isExists :", isExists);
      if (isExists) {
        return Result.fail("User already registered. Please log in instead.");
      }

      // Check if a verification code already exists for the given identifier
      const existingCode = await this.#verificationCodeRepository.findByIdentifier(payload.identifier);
      if (existingCode) {
        // Prevent sending multiple codes within 60 seconds
        const timeSinceLastCode = Date.now() - existingCode.createdAt.getTime();

        if (timeSinceLastCode < 60000) {
          return Result.fail({
            code: "RATE_LIMITED",
            message: "Please wait 60 seconds before requesting a new code."
          });
        }
      }

      // Generate a verification code and save it to the database
      const id = this.#idGeneratorService.generate();
      const code = generateCode();
      const codeHash = await this.#hashService.hash(code);
      const expiresAt = new Date(Date.now() + 100 * 60 * 1000);  // 10 minutes from now
      const verificationCode = new VerificationCode({
        id,
        identifier: payload.identifier,
        codeHash,
        expiresAt,
      });

      // Save verification code to repository
      await this.#verificationCodeRepository.save(verificationCode);

      // Send code to a user
      await this.#notificationService.sendVerificationCode(payload.identifier, code);

      return Result.ok();
    } catch (error) {
      this.#logger.error('Failed to send verification code', {
        identifier: payload.identifier,
        channel: payload.channel,
        error: error.message,
        stack: error.stack
      });

      return Result.fail(error.message);
    }
  }
}

export default SendVerificationCode;