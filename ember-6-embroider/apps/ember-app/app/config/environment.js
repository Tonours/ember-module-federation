import loadConfigFromMeta from '@embroider/config-meta-loader';
import { assert } from '@ember/debug';

let config = loadConfigFromMeta('ember-app');

// Fallback config for Module Federation mode (when loaded in another app)
if (!config || typeof config !== 'object') {
  // Use Vite env var (injected at build time) or default to localhost
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

  config = {
    modulePrefix: 'ember-app',
    environment: 'development',
    rootURL: '/',
    locationType: 'none', // Don't manipulate browser URL - React Router handles it
    APP: {
      API_URL: apiUrl,
    },
  };
}

assert(
  'config is not an object',
  typeof config === 'object' && config !== null
);
assert(
  'modulePrefix was not detected on your config',
  'modulePrefix' in config && typeof config.modulePrefix === 'string'
);
assert(
  'locationType was not detected on your config',
  'locationType' in config && typeof config.locationType === 'string'
);
assert(
  'rootURL was not detected on your config',
  'rootURL' in config && typeof config.rootURL === 'string'
);
assert(
  'APP was not detected on your config',
  'APP' in config && typeof config.APP === 'object'
);

export default config;
