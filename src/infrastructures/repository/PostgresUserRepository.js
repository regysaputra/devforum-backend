import UserRepository from "../../applications/interfaces/UserRepository.js";
import User from "../../domains/User.js";

class PostgresUserRepository extends UserRepository {
  #dbPool;

  constructor({ dbPool }) {
    super();
    this.#dbPool = dbPool;
  }

  async save(user) {
    const query = {
      text: "INSERT INTO users(id, full_name, username, email, phone_number, password, verified) VALUES($1, $2, $3, $4, $5, $6, $7)",
      values: [
        user.id,
        user.fullName,
        user.username,
        user.email,
        user.phoneNumber,
        user.password,
        user.verified,
      ]
    }

    await this.#dbPool.query(query);
  }

  async findVerifiedUserByIdentifier(identifier) {
    const query = {
      text: "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1 OR phone_number = $1 AND verified = true)",
      values: [identifier]
    }

    const result = await this.#dbPool.query(query);

    return result.rows[0].exists;
  }

  async findById(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id]
    };

    const result = await this.#dbPool.query(query);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findByEmail(email) {
    const query = {
      text: `
        SELECT 
            u.id,
            u.full_name AS fullName,
            u.username,
            u.email,
            u.phone_number as phoneNumber,
            u.password,
            u.verified,
            u.created_at AS createdAt,
            u.updated_at AS updatedAt
        FROM users u
        WHERE email = $1
      `,
      values: [email]
    };

    const result = await this.#dbPool.query(query);

    return result.rows[0];
  }

  async findByUsername(username) {
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username]
    };

    const result = await this.#dbPool.query(query);
    return result.rows[0];
  }
}

export default PostgresUserRepository;