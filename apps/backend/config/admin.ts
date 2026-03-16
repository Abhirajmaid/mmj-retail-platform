// Session lifespans in milliseconds (7 days, 30 days)
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    sessions: {
      maxSessionLifespan: env.int('ADMIN_SESSION_LIFESPAN_MS', SEVEN_DAYS_MS),
      maxRefreshTokenLifespan: env.int('ADMIN_REFRESH_TOKEN_LIFESPAN_MS', THIRTY_DAYS_MS),
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ADMIN_ENCRYPTION_KEY'),
  },
});
