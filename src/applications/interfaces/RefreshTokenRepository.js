class RefreshTokenRepository {
  async save(refreshToken) {
    throw new Error('REFRESH_TOKEN_REPOSITORY.SAVE.METHOD_NOT_IMPLEMENTED');
  }

  async findByToken(tokenHash) {
    throw new Error('REFRESH_TOKEN_REPOSITORY.FIND_BY_TOKEN.METHOD_NOT_IMPLEMENTED');
  }

  async revoke(id) {
    throw new Error('REFRESH_TOKEN_REPOSITORY.REVOKE.METHOD_NOT_IMPLEMENTED');
  }

  async revokeChain(id) {
    throw new Error('REFRESH_TOKEN_REPOSITORY.REVOKE_CHAIN.METHOD_NOT_IMPLEMENTED');
  }

  async rotateTokens(oldToken, newToken) {
    throw new Error('REFRESH_TOKEN_REPOSITORY.ROTATE_TOKENS.METHOD_NOT_IMPLEMENTED');
  }

  async findLatestSession(userId) {
    throw new Error('REFRESH_TOKEN_REPOSITORY.FIND_LATEST_SESSION.METHOD_NOT_IMPLEMENTED');
  }
}

export default RefreshTokenRepository;