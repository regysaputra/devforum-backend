import RefreshTokenRepository from "../../applications/interfaces/RefreshTokenRepository.js";
import Result from "../../shared/core/Result.js";
import RefreshToken from "../../domains/RefreshToken.js";

class PostgresRefreshTokenRepository extends RefreshTokenRepository {
  #dbPool;

  constructor({ dbPool }) {
    super();
    this.#dbPool = dbPool;
  }

  async save(refreshToken) {
    const query = {
      text: `
            INSERT INTO refresh_tokens(
                                       id, 
                                       user_id, 
                                       token_hash,
                                       user_agent, 
                                       ip_address,
                                       latitude,
                                       longitude,
                                       city,
                                       country,
                                       expires_at
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      values: [
        refreshToken.id,
        refreshToken.userId,
        refreshToken.tokenHash,
        refreshToken.userAgent,
        refreshToken.ipAddress,
        refreshToken.latitude,
        refreshToken.longitude,
        refreshToken.city,
        refreshToken.country,
        refreshToken.expiresAt
      ]
    };

    await this.#dbPool.query(query);

    return true;
  }

  async findByToken(tokenHash) {
    const query = {
      text: "SELECT * FROM refresh_tokens WHERE token_hash = $1",
      values: [tokenHash]
    };

    const result = await this.#dbPool.query(query);

    if (result.rows.length === 0) {
      return null;
    }

    return new RefreshToken({
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      tokenHash: result.rows[0].token_hash,
      parentId: result.rows[0].parent_id,
      replacedBy: result.rows[0].replaced_by,
      revokedAt: result.rows[0].revoked_at,
      userAgent: result.rows[0].user_agent,
      ipAddress: result.rows[0].ip_address,
      latitude: result.rows[0].latitude,
      longitude: result.rows[0].longitude,
      city: result.rows[0].city,
      country: result.rows[0].country,
      expiresAt: result.rows[0].expires_at,
    })
  }

  async findLatestSession(userId) {
    const query = {
      text: "SELECT * FROM refresh_tokens WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      values: [userId]
    };

    const result = await this.#dbPool.query(query);

    if (result.rows.length === 0) {
      return null;
    }

    return new RefreshToken({
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      tokenHash: result.rows[0].token_hash,
      parentId: result.rows[0].parent_id,
      replacedBy: result.rows[0].replaced_by,
      revokedAt: result.rows[0].revoked_at,
      userAgent: result.rows[0].user_agent,
      ipAddress: result.rows[0].ip_address,
      latitude: result.rows[0].latitude,
      longitude: result.rows[0].longitude,
      city: result.rows[0].city,
      country: result.rows[0].country,
      expiresAt: result.rows[0].expires_at,
    });
  }

  async rotateTokens(oldToken, newToken) {
    const client = await this.#dbPool.connect();

    try {
      await client.query("BEGIN");

      // Step 1: Insert new token
      const insertQuery = {
        text: `INSERT INTO refresh_tokens(
                                          id,
                                          user_id,
                                          token_hash,
                                          parent_id,
                                          user_agent,
                                          ip_address,
                                          latitude,
                                          longitude,
                                          city,
                                          country,
                                          expires_at
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        values: [
          newToken.id,
          newToken.userId,
          newToken.tokenHash,
          oldToken.id,
          newToken.userAgent,
          newToken.ipAddress,
          newToken.latitude,
          newToken.longitude,
          newToken.city,
          newToken.country,
          newToken.expiresAt
        ]
      };

      await client.query(insertQuery);

      // Step 2: Revoke old token and link it to the new token
      const updateQuery = {
        text: "UPDATE refresh_tokens SET revoked_at = NOW(), replaced_by = $1 WHERE id = $2",
        values: [newToken.id, oldToken.id]
      };

      await client.query(updateQuery);

      // Commit transaction
      await client.query("COMMIT");

      return true;
    } catch (error) {
      await client.query("ROLLBACK");

      throw new Error("Failed to rotate tokens", { error: error.message });
    } finally {
      client.release();
    }
  }

  async revoke(id) {
    const query = {
      text: "UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1",
      values: [id]
    };

    await this.#dbPool.query(query);

    return true;
  }

  async revokeChain(id) {
    try {
      const query = {
        text: `''
            WITH RECURSIVE token_chain AS (
                -- Base case
                SELECT id, parent_id, replaced_by
                FROM refresh_tokens
                WHERE id = :given_id

                UNION ALL

                -- Walk forward (descendants via replaced_by)
                SELECT rt.id, rt.parent_id, rt.replaced_by
                FROM refresh_tokens rt
                         INNER JOIN token_chain tc ON rt.id = tc.replaced_by

                UNION ALL

                -- Walk backward (ancestors via parent_id)
                SELECT rt.id, rt.parent_id, rt.replaced_by
                FROM refresh_tokens rt
                         INNER JOIN token_chain tc ON rt.id = tc.parent_id
            )
            UPDATE refresh_tokens
            SET revoked_at = NOW()
            WHERE id IN (SELECT id FROM token_chain)
              AND revoked_at IS NULL;
        `,
        values: [id]
      };

      await this.#dbPool.query(query);

      return true;
    } catch (error) {
      throw new Error("Failed to revoke chain", { error: error.message });
    }
  }
}

export default PostgresRefreshTokenRepository;