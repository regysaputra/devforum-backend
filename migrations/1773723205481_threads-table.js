export const up = (pgm) => {
  pgm.createTable('threads', {
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
    title: {
      type: 'text',
      notNull: true,
    },
    body: {
      type: 'text',
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
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
    },
  });

  pgm.createIndex('threads', [
    { name: 'hotness_score', sort: 'DESC' }
  ], {
    name: 'idx_threads_hotness',
    method: 'btree',
  });
};

export const down = (pgm) => {
  pgm.dropTable('threads');
};
