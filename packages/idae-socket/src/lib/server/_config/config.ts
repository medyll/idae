export type AuthStrategy = 'jwt' | 'introspection' | 'none';

export const _config = {
  defaultPort: 4000,
  defaultHost: "http://127.0.0.1",
  urlTokenVerify: "https://.../json_token.php",
  corsOrigin: process.env.IDAE_SOCKET_CORS_ORIGIN || '*',
  redisUrl: process.env.IDAE_SOCKET_REDIS_URL,
  auth: {
    // 'jwt' for local validation, 'introspection' for remote API check
    strategy: (process.env.IDAE_SOCKET_AUTH_STRATEGY || 'none') as AuthStrategy,
    // JWT Secret or Public Key
    jwtSecret: process.env.IDAE_SOCKET_JWT_SECRET || 'change-me-in-production',
    // Introspection URL (e.g. https://api.myapp.com/auth/verify)
    introspectionUrl: process.env.IDAE_SOCKET_INTROSPECTION_URL || 'http://localhost:3000/auth/verify'
  }
};

