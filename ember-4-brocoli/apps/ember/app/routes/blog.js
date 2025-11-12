import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BlogRoute extends Route {
  @service iframeBridge;

  disconnectHeightObserver = null;

  activate() {
    super.activate();
    // Start observing height changes
    this.disconnectHeightObserver = this.iframeBridge.observeHeight();
  }

  deactivate() {
    super.deactivate();
    // Stop observing height changes
    if (this.disconnectHeightObserver) {
      this.disconnectHeightObserver();
      this.disconnectHeightObserver = null;
    }
  }
}
