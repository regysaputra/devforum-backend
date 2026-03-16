import {asValue} from "awilix";

function verifyAccessToken({ logger }) {
  return function(req, res, next) {
    try {
      const tokenService = req.container.resolve("tokenService");

      // Get authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: "fail",
          data: {
            message: "Missing token"
          }
        });
      }

      const token = authHeader.split(" ")[1];

      const decodedPayload = tokenService.verify(token);

      req.user = decodedPayload;

      req.container.register({
        user: asValue(decodedPayload)
      });

      next();
    } catch (error) {
      logger.error("Error verifying access token:", error.message);

      return res.status(401).json({
        status: "fail",
        data: {
          message: "Invalid or expired token"
        }
      });
    }
  };
}

export default verifyAccessToken;