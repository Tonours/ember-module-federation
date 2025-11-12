const getCorsOrigin = () => {
  const origins = process.env.CORS_ORIGIN;
  if (origins) {
    // If CORS_ORIGIN is '*', return true to allow all origins
    // (required when credentials: true, can't use literal '*')
    if (origins.trim() === '*') {
      return true;
    }
    // Production: specific origins (array)
    return origins.split(',').map((origin) => origin.trim());
  }
  // Development: allow all origins by returning true
  // (cors middleware will reflect the request's origin)
  return true;
};

export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: '7d',
  jwtRefreshExpiresIn: '30d',
  corsOrigin: getCorsOrigin(),
};
