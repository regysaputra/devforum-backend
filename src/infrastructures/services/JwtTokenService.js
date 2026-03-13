import jwt from "jsonwebtoken";
import TokenService from "../../applications/interfaces/TokenService.js";
import config from "../../shared/config/index.js";

class JwtTokenService extends TokenService {
  #logger;

  constructor({ logger }) {
    super();
    this.#logger = logger;
  }

  generate(payload) {
    return jwt.sign(
      payload,
      config.jwt.secretKey,
      {
        expiresIn: config.jwt.accessTokenExpiresIn
      }
    );
  }

  verify(token) {
    return jwt.verify(token, config.jwt.secretKey);
  }
}

export default JwtTokenService;