if (!process.env.APP_NAME) {
  throw new Error("FATAL ERROR: APP_NAME is not defined in the environment variables");
}

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("FATAL ERROR: JWT_SECRET_KEY is not defined in the environment variables");
}

if (!process.env.SMTP_HOST) {
  throw new Error("FATAL ERROR: SMTP_HOST is not defined in the environment variables");
}

const config = {
  app: {
    name: process.env.APP_NAME,
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'production',
  },
  database: {
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT, 10),
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    name: process.env.PG_DATABASE,
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    accessTokenExpiresIn: "30m",
    refreshTokenExpiresInDays: 1,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
  }
};

export default config;