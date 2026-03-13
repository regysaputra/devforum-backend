class VerificationCode {
  constructor(payload) {
    const { id, identifier, codeHash, expiresAt, createdAt } = payload;

    this.id = id;
    this.identifier = identifier;
    this.codeHash = codeHash;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
  }
}

export default VerificationCode;