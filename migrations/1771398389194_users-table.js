export const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    name: {
      type: 'text',
    },
    email: {
      type: 'text',
      unique: true,
    },
    phone_number: {
      type: 'text',
      unique: true,
    },
    password: {
      type: 'text',
      notNull: true,
    },
    verified: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
    }
  });
};

export const down = (pgm) => {
  pgm.dropTable('users');
};