export const up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    thread_id: {
      type: 'uuid',
      notNull: true,
      references: 'threads',
    },
    body: {
      type: 'text',
      notNull: true,
    },
    score: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    hotness_score: {
      type: 'float',
      notNull: true,
      default: 0,
    },
    deleted_at: {
      type: 'timestamptz',
      default: null,
    },
    created_at: {
      type: 'timestamptz',
    }
  })
};

export const down = (pgm) => {
  pgm.dropTable('comments');
};
