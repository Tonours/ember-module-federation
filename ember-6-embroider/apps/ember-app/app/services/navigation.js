import Service from '@ember/service';

export default class NavigationService extends Service {
  /**
   * Navigation callbacks injected from React Shell
   * React Router provides these functions to handle navigation
   */
  onNavigateToArticle = null;
  onNavigateToCategory = null;
  onNavigateToTag = null;
  onNavigateToBlog = null;
  onFilterChange = null;

  /**
   * Navigate to article detail page
   */
  navigateToArticle(articleId) {
    if (typeof this.onNavigateToArticle === 'function') {
      this.onNavigateToArticle(articleId);
    } else {
      console.warn('Article navigation handler not configured. ID:', articleId);
    }
  }

  /**
   * Navigate to category page
   */
  navigateToCategory(slug) {
    if (typeof this.onNavigateToCategory === 'function') {
      this.onNavigateToCategory(slug);
    } else {
      console.warn('Category navigation handler not configured. Slug:', slug);
    }
  }

  /**
   * Navigate to tag page
   */
  navigateToTag(slug) {
    if (typeof this.onNavigateToTag === 'function') {
      this.onNavigateToTag(slug);
    } else {
      console.warn('Tag navigation handler not configured. Slug:', slug);
    }
  }

  /**
   * Navigate to blog index
   */
  navigateToBlog() {
    if (typeof this.onNavigateToBlog === 'function') {
      this.onNavigateToBlog();
    } else {
      console.warn('Blog navigation handler not configured');
    }
  }

  /**
   * Update URL query params for filters
   */
  updateFilters(filters) {
    if (typeof this.onFilterChange === 'function') {
      this.onFilterChange(filters);
    } else {
      console.warn('Filter change handler not configured');
    }
  }

  /**
   * Set navigation handlers (called from React Shell)
   */
  setNavigationHandlers(handlers) {
    this.onNavigateToArticle = handlers.onNavigateToArticle;
    this.onNavigateToCategory = handlers.onNavigateToCategory;
    this.onNavigateToTag = handlers.onNavigateToTag;
    this.onNavigateToBlog = handlers.onNavigateToBlog;
    this.onFilterChange = handlers.onFilterChange;
  }
}
