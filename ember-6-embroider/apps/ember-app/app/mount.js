import Application from './app.js';
import config from './config/environment.js';

let emberAppInstance = null;
let emberApplication = null;

/**
 * Mount Ember Blog App in a container element
 * Exposed via Module Federation
 *
 * @param {HTMLElement} containerElement - DOM element to mount the app into
 * @param {Object} options - Configuration options
 * @param {string} options.initialRoute - Initial route to visit
 * @param {Object} options.queryParams - Query params (category, tag) for filters
 * @param {Function} options.onNavigateToArticle - Callback for article navigation
 * @param {Function} options.onNavigateToCategory - Callback for category navigation
 * @param {Function} options.onNavigateToTag - Callback for tag navigation
 * @param {Function} options.onNavigateToBlog - Callback for blog index navigation
 * @param {Function} options.onFilterChange - Callback for filter changes
 * @returns {Promise<Object>} App instance with unmount function
 */
export async function mount(containerElement, options = {}) {
  if (!containerElement) {
    throw new Error('Container element is required');
  }

  // Cleanup previous instances
  if (emberAppInstance) {
    await emberAppInstance.destroy();
    emberAppInstance = null;
  }

  if (emberApplication) {
    await emberApplication.destroy();
    emberApplication = null;
  }

  // Create application with custom rootElement
  const App = Application.extend({
    rootElement: containerElement,
    autoboot: false,
  });

  const app = App.create(config.APP);
  emberApplication = app;
  await app.boot();

  // Create and boot instance
  const appInstance = app.buildInstance();
  const initialRoute = options.initialRoute || '/';
  await appInstance.boot();
  await appInstance.visit(initialRoute);

  // Configure navigation callbacks if provided
  const navigationService = appInstance.lookup('service:navigation');
  if (navigationService) {
    navigationService.setNavigationHandlers({
      onNavigateToArticle: options.onNavigateToArticle,
      onNavigateToCategory: options.onNavigateToCategory,
      onNavigateToTag: options.onNavigateToTag,
      onNavigateToBlog: options.onNavigateToBlog,
      onFilterChange: options.onFilterChange,
    });
  }

  // Set query params on controller if provided
  if (options.queryParams) {
    const controller = appInstance.lookup('controller:index');
    if (controller) {
      // Prevent updateFilters from being called during initialization
      controller._skipFilterUpdate = true;

      if (options.queryParams.category) {
        controller.category = options.queryParams.category;
      }
      if (options.queryParams.tag) {
        controller.tag = options.queryParams.tag;
      }

      controller._skipFilterUpdate = false;
    }
  }

  emberAppInstance = appInstance;

  return {
    instance: appInstance,
    unmount: async () => {
      if (emberAppInstance) {
        await emberAppInstance.destroy();
        emberAppInstance = null;
      }
    },
  };
}

/**
 * Unmount current Ember app instance
 */
export async function unmount() {
  if (emberAppInstance) {
    await emberAppInstance.destroy();
    emberAppInstance = null;
  }
}

export default { mount, unmount };
