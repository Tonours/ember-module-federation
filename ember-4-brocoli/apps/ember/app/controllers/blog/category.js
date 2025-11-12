import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BlogCategoryController extends Controller {
  @service iframeBridge;

  @action
  navigateToArticle(articleId) {
    this.iframeBridge.navigateToArticle(articleId);
  }

  @action
  navigateToBlog() {
    this.iframeBridge.navigate('/blog');
  }
}
