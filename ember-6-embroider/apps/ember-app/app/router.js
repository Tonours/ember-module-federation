import EmberRouter from '@embroider/router';
import config from 'ember-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // When mounted via Module Federation, React handles /blog prefix
  // Routes are relative to the mount point
  this.route('index', { path: '/' });
  this.route('category', { path: '/category/:slug' });
  this.route('tag', { path: '/tag/:slug' });
});
