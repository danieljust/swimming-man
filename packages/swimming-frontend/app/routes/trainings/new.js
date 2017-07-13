import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  queryParams: {
    userId: ''
  },

  model(params) {
    return this.store.createRecord('training', {
      'userId': params.userId
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('title', 'New training');
  },

  renderTemplate() {
    this.render('trainings/form');
  },

  resetController(controller) {
    controller.get('model').rollbackAttributes();
    controller.set('errorMessage', null);
    controller.set('responseMessage', null);
    controller.set('isLoaded', false);
  }
});
