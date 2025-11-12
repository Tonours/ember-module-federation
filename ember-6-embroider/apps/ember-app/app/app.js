import Application from '@ember/application';
import compatModules from '@embroider/virtual/compat-modules';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'ember-app/config/environment';

// Deprecation workflow is only loaded in development mode
// In production, we skip this import to avoid bundling @embroider/macros stubs
// Original code used macroCondition(isDevelopingApp()) which should be transformed at build time
// but Vite bundling was including the stubs, so we remove it entirely for production

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
}

loadInitializers(App, config.modulePrefix, compatModules);
