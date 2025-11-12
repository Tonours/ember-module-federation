import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { federation } from '@module-federation/vite';

// Plugin to replace getGlobalConfig calls and @embroider/macros stubs
function replaceGetGlobalConfig() {
  const config = {
    WarpDrive: {
      env: {
        DEBUG: false,
      },
      includeDataAdapter: false,
      activeLogging: {
        LOG_GRAPH: false,
        LOG_METRIC_COUNTS: false,
        DEBUG_RELATIONSHIP_NOTIFICATIONS: false,
      },
      debug: {
        LOG_GRAPH: false,
        LOG_METRIC_COUNTS: false,
        DEBUG_RELATIONSHIP_NOTIFICATIONS: false,
      },
      deprecations: {
        DEPRECATE_EMBER_INFLECTOR: false,
        DEPRECATE_TRACKING_PACKAGE: false,
        DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
      },
    },
    // Fallback properties at root level for code that doesn't use WarpDrive namespace
    env: {
      DEBUG: false,
    },
    includeDataAdapter: false,
    activeLogging: {
      LOG_GRAPH: false,
      LOG_METRIC_COUNTS: false,
      DEBUG_RELATIONSHIP_NOTIFICATIONS: false,
    },
    debug: {
      LOG_GRAPH: false,
      LOG_METRIC_COUNTS: false,
      DEBUG_RELATIONSHIP_NOTIFICATIONS: false,
    },
    deprecations: {
      DEPRECATE_EMBER_INFLECTOR: false,
      DEPRECATE_TRACKING_PACKAGE: false,
      DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
    },
  };

  return {
    name: 'replace-get-global-config',
    enforce: 'pre',
    transform(code, id) {
      // Handle @embroider/macros stubs - replace entire module with safe implementations
      // Match any path to @embroider/macros (node_modules, .vite/deps, etc.)
      if (id.includes('@embroider/macros') && (id.includes('/src/index.js') || id.includes('.vite/deps'))) {
        console.log('[replace-get-global-config] Replacing @embroider/macros stubs in:', id);
        return {
          code: `
            export function getGlobalConfig() { return ${JSON.stringify(config)}; }
            export function getConfig() { return {}; }
            export function getOwnConfig() { return {}; }
            export function isDevelopingApp() { return ${process.env.NODE_ENV === 'development'}; }
            export function isTesting() { return false; }
            export function macroCondition(pred) { return pred; }
            export function importSync(module) { throw new Error('importSync not supported'); }
            export function dependencySatisfies() { return true; }
            export function appEmberSatisfies() { return true; }
            export function moduleExists() { return false; }
            export function failBuild() { throw new Error('Build failed'); }
            export function each(arr) { return arr; }
          `,
          map: null
        };
      }

      // Process @ember-data and @warp-drive packages (both in node_modules and .vite/deps)
      const shouldProcess =
        id.includes('node_modules/@ember-data') ||
        id.includes('node_modules/@warp-drive') ||
        id.includes('.vite/deps/ember-data') ||
        id.includes('.vite/deps/@warp-drive');

      if (!shouldProcess) {
        return null;
      }

      // Replace getGlobalConfig() calls with inline config
      if (code.includes('getGlobalConfig')) {
        console.log('[replace-get-global-config] Processing:', id);
        let transformed = code;

        // Replace various patterns of getGlobalConfig usage
        transformed = transformed.replace(
          /(\w+\s*=\s*)?getGlobalConfig\(\)/g,
          `(${JSON.stringify(config)})`
        );

        // Also replace import statements
        transformed = transformed.replace(
          /import\s+{\s*getGlobalConfig\s*}\s+from\s+['"]@embroider\/macros['"];?/g,
          `const getGlobalConfig = () => (${JSON.stringify(config)});`
        );

        if (transformed !== code) {
          console.log('[replace-get-global-config] Replaced getGlobalConfig in:', id);
          return { code: transformed, map: null };
        }
      }

      return null;
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/ember-app/' : '/',
  optimizeDeps: {
    // Exclude ember-data packages from Vite pre-bundling so our plugin can process them
    exclude: [
      'ember-data',
      '@ember-data/store',
      '@ember-data/model',
      '@ember-data/adapter',
      '@ember-data/serializer',
      '@ember-data/debug',
      '@ember-data/request-utils',
      '@warp-drive/core',
      '@warp-drive/legacy',
      '@warp-drive/json-api',
      '@warp-drive/utilities',
      '@embroider/macros', // Exclude macros to prevent stub functions from being bundled
    ],
  },
  server: {
    port: 4200,
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
  define: {
    // Define globals for excluded packages that use macros
    '__EMBROIDER_MACROS_GLOBAL_CONFIG__': JSON.stringify({
      WarpDrive: {
        env: {
          DEBUG: false,
        },
        includeDataAdapter: false,
        debug: {
          LOG_GRAPH: false,
          LOG_METRIC_COUNTS: false,
          DEBUG_RELATIONSHIP_NOTIFICATIONS: false,
        },
        deprecations: {
          DEPRECATE_EMBER_INFLECTOR: false,
          DEPRECATE_TRACKING_PACKAGE: false,
          DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
        },
      },
    }),
  },
  plugins: [
    replaceGetGlobalConfig(),
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
      configFile: './babel.config.cjs',
      filter: (id) => {
        // Always process @embroider/macros with Babel to transform macros
        if (id.includes('node_modules/@embroider/macros')) {
          return true;
        }
        // Exclude Module Federation virtual modules from Babel
        if (id.includes('__mf__virtual') || id.includes('node_modules/__mf__')) {
          return false;
        }
        // Exclude @ember-data and @warp-drive from Babel (already compiled, macros cause issues)
        if (id.includes('node_modules/@ember-data') || id.includes('node_modules/@warp-drive')) {
          return false;
        }
        return true;
      },
    }),
    federation({
      name: 'emberBlog',
      filename: 'remoteEntry.js',
      exposes: {
        './BlogApp': './app/mount.js',
      },
      shared: {},
    }),
  ],
}));
