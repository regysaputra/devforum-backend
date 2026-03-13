import crypto from "crypto";
import OpaqueTokenService from "../../applications/interfaces/OpaqueTokenService.js";

class CryptoOpaqueTokenService extends OpaqueTokenService {
  constructor() {
    super();
  }

  generate() {
    return crypto.randomBytes(40).toString("hex");
  }

  hash(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}

export default CryptoOpaqueTokenService;