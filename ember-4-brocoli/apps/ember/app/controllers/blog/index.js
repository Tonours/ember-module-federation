import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BlogIndexController extends Controller {
  @service iframeBridge;

  queryParams = ['category', 'tag'];

  @tracked category = null;
  @tracked tag = null;

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
    this.iframeBridge.navigateToArticle(articleId);
  }

  @action
  filterByCategory(event) {
    const value = event.target.value;
    this.category = value || null;
    this._syncQueryParams();
  }

  @action
  filterByTag(event) {
    const value = event.target.value;
    this.tag = value || null;
    this._syncQueryParams();
  }

  @action
  clearFilters() {
    this.category = null;
    this.tag = null;
    this._syncQueryParams();
  }

  _syncQueryParams() {
    const params = {};
    if (this.category) params.category = this.category;
    if (this.tag) params.tag = this.tag;
    this.iframeBridge.updateQueryParams(params);
  }
}
