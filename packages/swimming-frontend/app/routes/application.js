import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
const { service } = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: service('session'),
  currentUser: service('current-user'),
  beforeModel() {
    if(this.get('session.isAuthenticated')) {
      this.get('currentUser').extractUserFromSession();
      this.transitionTo(this.get('router.currentRouteName'));
    }
  },
  setupController(controller) {
    this._super(controller);
    controller.set('session', this.get('session'));
    controller.set('currentUser', this.get('currentUser'));
  }
});
