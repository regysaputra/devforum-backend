class TokenService {
  generate(payload) {
    throw new Error('TOKEN_MANAGER_SERVICE.GENERATE.METHOD_NOT_IMPLEMENTED');
  }

  verify(token) {
    throw new Error('TOKEN_MANAGER_SERVICE.VERIFY.METHOD_NOT_IMPLEMENTED');
  }
}

export default TokenService;