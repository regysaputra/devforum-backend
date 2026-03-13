import Result from "../../shared/core/Result.js";

class Logout {
  #logger;
  #opaqueTokenService;
  #refreshTokenRepository;

  constructor({ logger, opaqueTokenService, refreshTokenRepository }) {
    this.#logger = logger;
    this.#opaqueTokenService = opaqueTokenService;
    this.#refreshTokenRepository = refreshTokenRepository;
  }

  async execute(payload) {
    try {
      // Check if the refresh token exists in the database
      const refreshTokenHash = await this.#opaqueTokenService.hash(payload.refreshToken);
      const refreshTokenRecord = await this.#refreshTokenRepository.findByToken(refreshTokenHash);

      if (!refreshTokenRecord) {
        return Result.fail("Invalid refresh token");
      }

      // Revoke the refresh token
      await this.#refreshTokenRepository.revoke(refreshTokenRecord.id);

      return Result.ok();
    } catch (error) {
      this.#logger.error('Failed to logout', {
        error: error.message,
        stack: error.stack
      });

      return Result.fail(error.message);
    }
  }
}

export default Logout;