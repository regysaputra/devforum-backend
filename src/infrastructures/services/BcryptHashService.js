import bcrypt from "bcrypt";
import HashService from "../../applications/interfaces/HashService.js";

class BcryptHashService extends HashService {
  constructor() {
    super();
  }

  async hash(plainText) {
    if (!plainText) {
      throw new Error("HashService: plainText is required");
    }

    // Salt rounds: 10
    return await bcrypt.hash(plainText, 10);
  }

  async compare(plainText, hashedText) {
    if (!plainText || !hashedText) {
      return false;
    }

    return await bcrypt.compare(plainText, hashedText);
  }
}

export default BcryptHashService;