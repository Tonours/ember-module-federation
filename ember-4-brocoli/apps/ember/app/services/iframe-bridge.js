import Service from '@ember/service';
import { getOwner } from '@ember/application';

export default class IframeBridgeService extends Service {
  // Target origin for React Shell
  // Determined at runtime based on config or current window origin
  get targetOrigin() {
    const config = getOwner(this).resolveRegistration('config:environment');
    // Use config if provided (for dev with different ports)
    // Otherwise use current window origin (production - same domain)
    return config.APP.PARENT_ORIGIN || window.location.origin;
  }

  /**
   * Navigate to a specific article detail view in the React Shell
   * @param {string} articleId - The article ID to navigate to
   */
  navigateToArticle(articleId) {
    const message = {
      type: 'NAVIGATE',
      payload: {
        path: `/blog/${articleId}`
      }
    };

    // Send message to parent window (React Shell) with specific targetOrigin
    window.parent.postMessage(message, this.targetOrigin);
  }

  /**
   * Navigate to any path in the React Shell
   * @param {string} path - The path to navigate to
   */
  navigate(path) {
    const message = {
      type: 'NAVIGATE',
      payload: {
        path
      }
    };

    window.parent.postMessage(message, this.targetOrigin);
  }

  /**
   * Send content height to parent for iframe resizing
   * @param {number} height - The content height in pixels
   */
  sendHeight(height) {
    const message = {
      type: 'RESIZE',
      payload: {
        height
      }
    };

    window.parent.postMessage(message, this.targetOrigin);
  }

  /**
   * Observe content height changes and automatically send updates
   */
  observeHeight() {
    const sendCurrentHeight = () => {
      const height = document.body.scrollHeight;
      this.sendHeight(height);
    };

    // Send initial height
    sendCurrentHeight();

    // Observe DOM changes
    const observer = new ResizeObserver(() => {
      sendCurrentHeight();
    });

    observer.observe(document.body);

    return () => observer.disconnect();
  }

  /**
   * Update query parameters in the parent shell URL
   * @param {Object} params - Object with query params (e.g., { category: 'id', tag: 'id' })
   */
  updateQueryParams(params) {
    const message = {
      type: 'UPDATE_QUERY_PARAMS',
      payload: {
        params
      }
    };

    window.parent.postMessage(message, this.targetOrigin);
  }
}
