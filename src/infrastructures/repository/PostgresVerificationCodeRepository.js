import VerificationCodeRepository from "../../applications/interfaces/VerificationCodeRepository.js";
import VerificationCode from "../../domains/VerificationCode.js";

class PostgresVerificationCodeRepository extends VerificationCodeRepository {
  #dbPool;
  #logger;

  constructor({ dbPool, logger }) {
    super();
    this.#dbPool = dbPool;
    this.#logger = logger;
  }

  async save(verificationCode) {
    const query = {
      text: "INSERT INTO verification_codes(id, identifier, code_hash, expires_at) VALUES($1, $2, $3, $4)",
      values: [
        verificationCode.id,
        verificationCode.identifier,
        verificationCode.codeHash,
        verificationCode.expiresAt,
      ]
    };

    await this.#dbPool.query(query);
  }

  async findByIdentifier(identifier) {
    const query = {
      text: "SELECT * FROM verification_codes WHERE identifier = $1 AND expires_at > NOW()",
      values: [identifier]
    }

    const result = await this.#dbPool.query(query);

    if (result.rows.length === 0) {
      return null;
    }

    return new VerificationCode({
      id: result.rows[0].id,
      identifier: result.rows[0].identifier,
      codeHash: result.rows[0].code_hash,
      expiresAt: result.rows[0].expires_at,
      createdAt: result.rows[0].created_at
    });
  }

  async deleteByIdentifier(identifier) {
    const query = {
      text: "DELETE FROM verification_codes WHERE identifier = $1",
      values: [identifier]
    }

    await this.#dbPool.query(query);

    return true;
  }
}

export default PostgresVerificationCodeRepository;