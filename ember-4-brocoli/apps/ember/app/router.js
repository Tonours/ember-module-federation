import EmberRouter from '@ember/routing/router';
import config from 'ember-4/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('blog', { path: '/blog' }, function() {
    this.route('category', { path: '/category/:slug' });
    this.route('tag', { path: '/tag/:slug' });
  });
});
