export const up = (pgm) => {
  pgm.createTable('tags', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    name: {
      type: 'text',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('tags');
};
