import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { scheduleOnce } from '@ember/runloop';

export default class BlogIndexController extends Controller {
  @service navigation;

  @tracked category = null;
  @tracked tag = null;

  // Flag to prevent updateFilters during initialization from React
  _skipFilterUpdate = false;

  get hasActiveFilters() {
    return this.category || this.tag;
  }

  get selectedCategory() {
    return this.category || '';
  }

  get selectedTag() {
    return this.tag || '';
  }

  @action
  navigateToArticle(articleId) {
    this.navigation.navigateToArticle(articleId);
  }

  @action
  navigateToCategory(slug) {
    this.navigation.navigateToCategory(slug);
  }

  @action
  navigateToTag(slug) {
    this.navigation.navigateToTag(slug);
  }

  @action
  filterByCategory(event) {
    const value = event.target.value;
    this.category = value || null;
    scheduleOnce('afterRender', this, '_updateFilters');
  }

  @action
  filterByTag(event) {
    const value = event.target.value;
    this.tag = value || null;
    scheduleOnce('afterRender', this, '_updateFilters');
  }

  @action
  clearFilters() {
    this.category = null;
    this.tag = null;
    scheduleOnce('afterRender', this, '_updateFilters');
  }

  _updateFilters() {
    // Avoid calling updateFilters during initialization or destruction
    if (this._skipFilterUpdate || this.isDestroying || this.isDestroyed) {
      return;
    }

    const filters = {};
    if (this.category) filters.category = this.category;
    if (this.tag) filters.tag = this.tag;
    this.navigation.updateFilters(filters);
  }
}
