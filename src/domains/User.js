class User {
  constructor(payload) {
    const { id, name, email, phoneNumber, password, verified, createdAt, updatedAt } = payload;

    this.id = id;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.verified = verified;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static isEmail(string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(string);
  }

  static isPhone(string) {
    // This allows optional +, followed by 10 to 15 digits
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(string);
  }
}

export default User;