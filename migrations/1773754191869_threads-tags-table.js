export const up = (pgm) => {
  pgm.createTable('threads_tags', {
    thread_id: {
      type: 'uuid',
      notNull: true,
      references: 'threads',
      onDelete: 'cascade',
    },
    tag_id: {
      type: 'uuid',
      notNull: true,
      references: 'tags',
      onDelete: 'cascade',
    }
  }, {
    constraints: {
      primaryKey: ['thread_id', 'tag_id']
    }
  })
};

export const down = (pgm) => {
  pgm.dropTable('threads_tags');
};
