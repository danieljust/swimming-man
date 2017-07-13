import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import errorProcessor from '../../utils/error-processor';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  errorMessage: null,
  model(params){
    return this.get('store').findRecord('user', params.user_id)
      .catch(error => {
        if(error.errors[0].code === 404 || error.errors[0].code === 403) this.transitionTo('/not-found');
        else {
          const Error = errorProcessor(error);
          this.set('errorMessage', Error)
        }
      });
  },
  setupController(controller, model){
    this._super(controller, model);
    controller.set('errorMessage', this.get('errorMessage'));
  },
  resetController(controller) {
    controller.get('model').rollbackAttributes();
    controller.set('isSaved', false);
    controller.set('responseMessage', null);
    controller.set('errorMessage', null);
  }
});
