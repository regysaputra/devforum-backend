class UserRepository {
  async save(user) {
   throw new Error('USER_REPOSITORY.SAVE.METHOD_NOT_IMPLEMENTED');
  }

  async findVerifiedUserByIdentifier(identifier) {
   throw new Error('USER_REPOSITORY.FIND_VERIFIED_USER_BY_IDENTIFIER.METHOD_NOT_IMPLEMENTED');
  }

  async findById(id) {
    throw new Error('USER_REPOSITORY.FIND_BY_ID.METHOD_NOT_IMPLEMENTED');
  }

  async findByEmail(email) {
    throw new Error('USER_REPOSITORY.FIND_BY_EMAIL.METHOD_NOT_IMPLEMENTED');
  }
}

export default UserRepository;