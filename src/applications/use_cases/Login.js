import Result from "../../shared/core/Result.js";
import {calculateHaversineDistance} from "../../shared/utils/index.js";
import RefreshToken from "../../domains/RefreshToken.js";

class Login {
  #logger;
  #userRepository;
  #refreshTokenRepository;
  #tokenService;
  #opaqueTokenService;
  #idGeneratorService;
  #hashService;
  #locationService;
  #notificationService;

  constructor({ logger, userRepository, refreshTokenRepository, tokenService, opaqueTokenService, idGeneratorService, hashService, locationService, notificationService }) {
    this.#logger = logger;
    this.#userRepository = userRepository;
    this.#refreshTokenRepository = refreshTokenRepository;
    this.#tokenService = tokenService;
    this.#opaqueTokenService = opaqueTokenService;
    this.#idGeneratorService = idGeneratorService;
    this.#hashService = hashService;
    this.#locationService = locationService;
    this.#notificationService = notificationService;
  }

  async execute(payload) {
    try {
      // Check if verified user exists
      const userRecord = await this.#userRepository.findByEmail(payload.email);

      if (!userRecord) {
        return Result.fail("Invalid credentials");
      }

      // Check if the password is valid
      const isValid = await this.#hashService.compare(payload.password, userRecord.password);
      if (!isValid) {
        return Result.fail("Invalid credentials");
      }

      // Impossible travel detection
      const currentLocation = await this.#locationService.lookup(payload.ip);
      const latestSession = await this.#refreshTokenRepository.findLatestSession(userRecord.id);

      if(latestSession && latestSession.ipAddress && latestSession.ipAddress !== payload.ip) {
        const latestLocation = this.#locationService.lookup(latestSession.ipAddress);

        // Calculate distance and time
        const distanceKm = calculateHaversineDistance(
          latestLocation.latitude, latestLocation.longitude,
          currentLocation.latitude, currentLocation.longitude
        );

        const hoursSinceLastLogin = this.#calculateHoursSinceLastLogin(latestSession);

        // Prevent division by zero if user login instantly from the new IP
        const safeHours = Math.max(hoursSinceLastLogin, 0.01);

        // Calculate velocity
        const velocity = distanceKm / safeHours;
        if (velocity > 900) {
          this.#logger.warn("Impossible travel detected", {
            userId: userRecord.id,
            speed: velocity,
            ip: payload.ip,
          });

          this.#notificationService.sendSecurityAlert(payload.email, payload.userAgent.browser, payload.userAgent.os, payload.userAgent.device);
        }
      }

      // Generate a new access token and refresh token
      const accessToken = this.#tokenService.generate({ userId: userRecord.id });
      const refreshToken = this.#opaqueTokenService.generate({ userId: userRecord.id });
      const refreshTokenHash = await this.#opaqueTokenService.hash(refreshToken);
      let refreshTokenExpiresAt;

      if (payload.rememberMe) {
        refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      } else {
        refreshTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
      }

      // Create a new refresh token entity
      const refreshTokenEntity = new RefreshToken({
        id: this.#idGeneratorService.generate(),
        userId: userRecord.id,
        tokenHash: refreshTokenHash,
        userAgent: payload.userAgent,
        ipAddress: payload.ip,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        city: currentLocation.city,
        country: currentLocation.country,
        expiresAt: refreshTokenExpiresAt,
      });

      // Save the refresh token entity to the database
      await this.#refreshTokenRepository.save(refreshTokenEntity);

      return Result.ok({
        user: {
          id: userRecord.id,
          name: userRecord.name
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: refreshTokenExpiresAt,
      });
    } catch (error) {
      this.#logger.error('Failed to login', {
        error: error.message,
        stack: error.stack
      });

      return Result.fail(error.message);
    }
  }

  #calculateHoursSinceLastLogin(latestSession) {
    // Check if session exists and has createdAt
    if (!latestSession?.createdAt) {
      return null; // or some default value
    }

    // Ensure createdAt is a Date object
    const createdAtDate = latestSession.createdAt instanceof Date
      ? latestSession.createdAt
      : new Date(latestSession.createdAt);

    // Check if the date is valid
    if (isNaN(createdAtDate.getTime())) {
      console.error('Invalid date:', latestSession.createdAt);
      return null;
    }

    return (Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60);
  }
}

export default Login;