export const up = (pgm) => {
  pgm.createTable('comment_votes', {
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
    comment_id: {
      type: 'uuid',
      notNull: true,
      references: 'comments',
    },
    vote_value: {
      type: 'smallint',
      notNull: true,
      check: 'vote_value IN (-1, 1)',
      comment: '1 for upvote, -1 for downvote',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  })
};

export const down = (pgm) => {
  pgm.dropTable('comment_votes');
};
