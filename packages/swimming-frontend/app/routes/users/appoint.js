import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import errorProcessor from '../../utils/error-processor';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  errorMessage: null,
  model(params){
    return Ember.RSVP.hash({
      user: this.store.findRecord('user', params.user_id, { reload: true }),
      managers: this.store.findAll('manager')
    })
    .catch(error => {
      if(error.errors[0].code === 404 || error.errors[0].code === 403) this.transitionTo('/not-found');
      else {
        const Error = errorProcessor(error);
        this.set('errorMessage', Error)
      }
    })
  },
  setupController(controller, model){
    this._super(controller, model);
    controller.set('errorMessage', this.get('errorMessage'));
  },
  resetController(controller){
    controller.set('errorMessage', null);
    this.get('store').unloadAll('manager');
  }
});
