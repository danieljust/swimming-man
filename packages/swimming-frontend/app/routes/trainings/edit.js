import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import errorProcessor from '../../utils/error-processor';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  errorMessage: null,
  model(params){
    return this.get('store').findRecord('training', params.training_id)
      .catch(error => {
      if(error.errors[0].code === 404 || error.errors[0].code === 403) this.transitionTo('/not-found');
      else {
        const Error = errorProcessor(error);
        this.set('errorMessage', Error)
      }
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('title', 'Edit training');
    controller.set('errorMessage', this.get('errorMessage'));
    model.set('hours', model.get('duration.hours'));
    model.set('minutes', model.get('duration.minutes'));
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
