import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Route.extend({
  session: service('session'),
  beforeModel(transition){
    if(this.get('session.isAuthenticated')){
      transition.abort();
      this.transitionTo('index');
    }
  },
  model() {
    return this.store.createRecord('registration');
  },
  resetController(controller) {
      controller.get('model').rollbackAttributes();
      controller.set('errorMessage', '');
  }
});
