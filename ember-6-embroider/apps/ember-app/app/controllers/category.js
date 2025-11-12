import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BlogCategoryController extends Controller {
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
  navigateToTag(slug) {
    this.navigation.navigateToTag(slug);
  }
}
