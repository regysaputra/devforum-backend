class PostgresThreadRepository {
  #dbPool;

  constructor({ dbPool }) {
    this.#dbPool = dbPool;
  }

  async getAll() {
    const query = {
      text: `
          SELECT
              t.id,
              t.title,
              t.body,
              t.hotness_score AS hotnessScore,
              t.created_at AS createdAt,
              t.updated_at AS updatedAt,
              json_build_object(
                'id', u.id,
                'full_name', u.full_name,
                'username', u.username
              ) AS author,
              COALESCE(array_agg(tg.name) FILTER (WHERE tg.name IS NOT NULL), ARRAY[]::text[]) AS tags,
              (
                SELECT COUNT(*)::int
                FROM comments c
                WHERE c.thread_id = t.id    
              ) AS totalComment
          FROM threads t
          INNER JOIN users u ON t.user_id = u.id
          LEFT JOIN threads_tags tt ON t.id = tt.thread_id
          LEFT JOIN tags tg ON tt.tag_id = tg.id
          GROUP BY t.id, u.id
          ORDER BY t.created_at DESC;
      `,
    };

    const result = await this.#dbPool.query(query);

    return result.rows;
  }
}

export default PostgresThreadRepository;