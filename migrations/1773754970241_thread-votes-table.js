export const up = (pgm) => {
  pgm.createTable('thread_votes', {
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
      onDelete: 'cascade',
    }
  }, {
    constraints: {
      unique: ['user_id', 'thread_id']
    }
  })
};

export const down = (pgm) => {
  pgm.dropTable('thread_votes');
};
