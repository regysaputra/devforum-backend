export const up = (pgm) => {
  pgm.createTable('verification_codes', {
    id: {
      type: "uuid",
      primaryKey: true,
      notNull: true,
    },
    identifier: {
      type: 'text',
      notNull: true,
    },
    code_hash: {
      type: 'text',
      notNull: true,
    },
    expires_at: {
      type: 'timestamptz',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    }
  });

  pgm.createIndex('verification_codes', 'identifier');
  pgm.createIndex('verification_codes', 'expires_at');
};

export const down = (pgm) => {
  pgm.dropTable('verification_codes');
};