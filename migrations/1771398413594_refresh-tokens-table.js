export const up = (pgm) => {
  pgm.createTable('refresh_tokens', {
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
    token_hash: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    parent_id: {
      type: 'uuid',
    },
    replaced_by: {
      type: 'uuid',
    },
    revoked_at: {
      type: 'timestamptz',
    },
    user_agent: {
      type: 'jsonb',
      default: '{}',
    },
    ip_address: {
      type: 'text',
    },
    latitude: {
      type: 'decimal(10, 8)',
    },
    longitude: {
      type: 'decimal(11, 8)',
    },
    city: {
      type: 'text',
    },
    country: {
      type: 'text',
    },
    expires_at: {
      type: 'timestamptz',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createIndex('refresh_tokens', 'user_id');
  pgm.createIndex('refresh_tokens', 'token_hash');
  pgm.createIndex('refresh_tokens', 'parent_id');
  pgm.createIndex('refresh_tokens', 'replaced_by');
};

export const down = (pgm) => {
  pgm.dropTable('refresh_tokens');
};
