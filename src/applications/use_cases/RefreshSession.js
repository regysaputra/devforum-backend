import Result from "../../shared/core/Result.js";
import RefreshToken from "../../domains/RefreshToken.js";

class RefreshSession {
  #logger;
  #refreshTokenRepository;
  #tokenService;
  #opaqueTokenService;
  #idGeneratorService;

  constructor({ logger, refreshTokenRepository, tokenService, opaqueTokenService, idGeneratorService }) {
    this.#logger = logger;
    this.#refreshTokenRepository = refreshTokenRepository;
    this.#tokenService = tokenService;
    this.#opaqueTokenService = opaqueTokenService;
    this.#idGeneratorService = idGeneratorService;
  }

  async execute(payload) {
    try {
      // Hash the refresh token
      const refreshTokenHash = await this.#opaqueTokenService.hash(payload.refreshToken);

      // Check if the refresh token exists in the database
      const refreshTokenRecord = await this.#refreshTokenRepository.findByToken(refreshTokenHash);

      if (!refreshTokenRecord) {
        return Result.fail("invalid refresh token");
      }

      // If this token has already been revoked, someone is trying to reuse it
      if (refreshTokenRecord.revokedAt) {
        this.#logger.warn("SECURITY ALERT: Refresh token reused detected.", {
          userId: refreshTokenRecord.userId,
          tokenId: refreshTokenRecord.id,
        });

        // Invalidate the entire token chain
        await this.#refreshTokenRepository.revokeChain(refreshTokenRecord.id);

        return Result.fail({
          code: 'SECURITY_COMPROMISED',
          message: 'Suspicious activity detected. Please log in again.'
        });
      }

      // Check if the refresh token has expired
      if (new Date() > refreshTokenRecord.expiresAt) {
        return Result.fail("Refresh token expired. Please log in again.");
      }

      // Generate a new access token and refresh token
      const newAccessToken = this.#tokenService.generate({ userId: refreshTokenRecord.userId });
      const newRefreshToken = this.#opaqueTokenService.generate();
      const newRefreshTokenHash = await this.#opaqueTokenService.hash(newRefreshToken);

      refreshTokenRecord.revokedAt = new Date();

      // Create a new refresh token entity
      const newRefreshTokenEntity = new RefreshToken({
        id: this.#idGeneratorService.generate(),
        userId: refreshTokenRecord.userId,
        tokenHash: newRefreshTokenHash,
        parentId: refreshTokenRecord.id,
        userAgent: payload.userAgent,
        ipAddress: refreshTokenRecord.ipAddress,
        expiresAt: refreshTokenRecord.expiresAt,
      });

      await this.#refreshTokenRepository.rotateTokens(refreshTokenRecord, newRefreshTokenEntity);

      return Result.ok({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: refreshTokenRecord.expiresAt,
      });
    } catch (error) {
      this.#logger.error('Failed to refresh session', {
        error: error.message,
        stack: error.stack
      });

      return Result.fail(error.message);
    }
  }
}

export default RefreshSession;