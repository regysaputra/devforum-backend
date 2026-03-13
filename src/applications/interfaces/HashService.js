class HashService {
  async hash(plainText) {
    throw new Error('HASH_SERVICE.HASH.METHOD_NOT_IMPLEMENTED');
  }

  async compare(plainText, hashedText) {
    throw new Error("HASH_SERVICE.COMPARE.METHOD_NOT_IMPLEMENTED");
  }
}

export default HashService;