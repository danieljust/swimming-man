import Ember from 'ember';

export default Ember.Controller.extend({
  session: null,
  currentUser: null,
  actions: {
    logout() {
      const session = this.get('session');
      if (session && session.session) {
        this.get('session').invalidate()
      }
    }
  }
});
