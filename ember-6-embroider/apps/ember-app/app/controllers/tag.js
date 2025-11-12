import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BlogTagController extends Controller {
  @service navigation;

  @action
  navigateToArticle(articleId) {
    this.navigation.navigateToArticle(articleId);
  }

  @action
  navigateToBlog() {
    this.navigation.navigateToBlog();
  }

  @action
  navigateToCategory(slug) {
    this.navigation.navigateToCategory(slug);
  }

  @action
  navigateToTag(slug) {
    this.navigation.navigateToTag(slug);
  }
}
