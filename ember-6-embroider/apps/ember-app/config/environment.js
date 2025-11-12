'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'ember-app',
    environment,
    rootURL: environment === 'production' ? '/ember-app/' : '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // API configuration
      API_URL: process.env.API_URL || '/api',
    },

    emberData: {
      deprecations: {
        DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
      },
    },
  };

  if (environment === 'development') {
    ENV.APP.API_URL = process.env.API_URL || 'http://localhost:3333/api';
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
