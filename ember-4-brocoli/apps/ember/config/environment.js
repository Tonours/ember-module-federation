'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'ember-4',
    environment,
    // Dev: served at root (localhost:4200/)
    // Prod: served under /ember/ path
    rootURL: environment === 'production' ? '/ember/' : '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      // Use relative URL for production, can be overridden via env var for dev
      API_URL: process.env.API_URL || '/api',
      // Parent origin for iframe postMessage (React Shell)
      // In production (same domain), use current origin
      // Can be overridden for dev with different ports
      PARENT_ORIGIN: process.env.PARENT_ORIGIN || null // null = use window.location.origin at runtime
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
