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
  resetController(controller) {
    controller.set('email', null);
    controller.set('password', null);
    controller.set('errorMessage', null);
  }
});
