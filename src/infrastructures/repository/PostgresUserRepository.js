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
      text: "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
      values: [
        user.id,
        user.name,
        user.email,
        user.phoneNumber,
        user.password,
        user.verified,
        user.createdAt,
        user.updatedAt
      ]
    }

    await this.#dbPool.query(query);

    return true;
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
      text: "SELECT * FROM users WHERE email = $1",
      values: [email]
    };

    const result = await this.#dbPool.query(query);

    return new User({
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      phoneNumber: result.rows[0].phone_number,
      password: result.rows[0].password,
      verified: result.rows[0].verified,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    });
  }
}

export default PostgresUserRepository;