class RefreshToken {
  constructor(payload) {
    const { id, userId, tokenHash, parentId, replacedBy, revokedAt, userAgent, ipAddress, latitude, longitude, city, country, expiresAt, createdAt } = payload;

    this.id = id;
    this.userId = userId;
    this.tokenHash = tokenHash;
    this.parentId = parentId;
    this.replacedBy = replacedBy;
    this.revokedAt = revokedAt;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
    this.latitude = latitude;
    this.longitude = longitude;
    this.city = city;
    this.country = country;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
  }
}

export default RefreshToken;