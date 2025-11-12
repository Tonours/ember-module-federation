// Dynamic remote loader for Vite ESM remote
export default async () => {
  // Use relative URL if EMBER_APP_URL not set (works on same domain like Coolify)
  // Otherwise use the provided URL (for local Docker)
  const emberBaseUrl = process.env.EMBER_APP_URL || window.location.origin + '/ember-app';
  const remoteUrl = `${emberBaseUrl}/remoteEntry.js`;
  const module = await import(/* webpackIgnore: true */ remoteUrl);
  return module;
};
