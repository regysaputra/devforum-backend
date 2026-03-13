class VerificationCodeRepository {
  async save(verificationCode) {
    throw new Error("VERIFICATION_CODE_REPOSITORY.SAVE.METHOD_NOT_IMPLEMENTED");
  }

  async findByIdentifier(identifier) {
    throw new Error("VERIFICATION_CODE_REPOSITORY.FIND_BY_IDENTIFIER.METHOD_NOT_IMPLEMENTED");
  }

  async deleteByIdentifier(identifier) {
    throw new Error("VERIFICATION_CODE_REPOSITORY.DELETE_BY_IDENTIFIER.METHOD_NOT_IMPLEMENTED");
  }
}

export default VerificationCodeRepository;