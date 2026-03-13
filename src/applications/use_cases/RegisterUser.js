import Result from "../../shared/core/Result.js";
import User from "../../domains/User.js";
import RefreshToken from "../../domains/RefreshToken.js";

class RegisterUser {
  #userRepository;
  #verificationCodeRepository;
  #refreshTokenRepository;
  #tokenService;
  #hashService;
  #opaqueTokenService;
  #idGeneratorService;
  #locationService;
  #logger;

  constructor({ userRepository, verificationCodeRepository, refreshTokenRepository, tokenService, hashService, opaqueTokenService, idGeneratorService, locationService, logger }) {
    this.#userRepository = userRepository;
    this.#verificationCodeRepository = verificationCodeRepository;
    this.#refreshTokenRepository = refreshTokenRepository;
    this.#tokenService = tokenService;
    this.#hashService = hashService;
    this.#opaqueTokenService = opaqueTokenService;
    this.#idGeneratorService = idGeneratorService;
    this.#locationService = locationService;
    this.#logger = logger;
  }

  async execute(payload) {
    try {
      // Check if a verified user exists with a given identifier
      const isExists = await this.#userRepository.findVerifiedUserByIdentifier(payload.identifier);

      if (isExists) {
        return Result.fail("User already registered. Please log in instead.");
      }

      // Hash the password
      const password = await this.#hashService.hash(payload.password);

      // Check if a identifier is email or phone
      const isValidEmail = User.isEmail(payload.identifier);
      const isValidPhone = User.isPhone(payload.identifier);

      // Save the user to the database
      const user = new User({
        id: this.#idGeneratorService.generate(),
        name: payload.name,
        email: isValidEmail ? payload.identifier : null,
        phoneNumber: isValidPhone ? payload.identifier : null,
        password: password,
        verified: true,
        createdAt: new Date(),
        updatedAt: null,
      });

      const result = await this.#userRepository.save(user);

      if (result) {
        this.#logger.error('Register user failed', {
          identifier: payload.identifier,
          dbError: result.error,
        });

        return Result.fail("Failed to create account. Please try again");
      }

      const accessToken = this.#tokenService.generate({ userId: user.id });
      const refreshToken = this.#opaqueTokenService.generate({ userId: user.id });
      const refreshTokenHash = await this.#opaqueTokenService.hash(refreshToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

      // Get geolocation
      const location = await this.#locationService.lookup(payload.ip);
      if (!location) {
        return Result.fail("Failed to get location");
      }

      // Create a new refresh token entity
      const refreshTokenEntity = new RefreshToken({
        id: this.#idGeneratorService.generate(),
        userId: user.id,
        tokenHash: refreshTokenHash,
        userAgent: JSON.stringify(payload.userAgent),
        ipAddress: payload.ip,
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        country: location.country,
        expiresAt: expiresAt, // 1 day
      });

      // Save the refresh token entity to the database
      await this.#refreshTokenRepository.save(refreshTokenEntity);

      // Remove verification code from db
      await this.#verificationCodeRepository.deleteByIdentifier(payload.identifier);

      return Result.ok({
        user: {
          id: user.id,
          name: user.name
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
      });
    } catch (error) {
      this.#logger.error('Unexpected error during register user', {error: error.message});
      return Result.fail(error.message);
    }
  }
}

export default RegisterUser;