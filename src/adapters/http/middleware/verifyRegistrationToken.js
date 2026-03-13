function verifyRegistrationToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "fail",
        data: {
          message: "missing registration token"
        }
      });
    }

    const token = authHeader.split(' ')[1];
    const tokenService = req.container.resolve("tokenService");
    const verifiedToken = tokenService.verify(token);

    if (!verifiedToken.identifier) {
      return res.status(401).json({
        status: "fail",
        data: {
          message: "Invalid or expired registration token"
        }
      });
    }

    req.identifier = verifiedToken.identifier;
    next();
  } catch (error) {
    next(error);
  }
}

export default verifyRegistrationToken;