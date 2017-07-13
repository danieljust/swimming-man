import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  session: service('session'),
  currentUser: service('current-user'),
  actions: {
    authenticate() {
      let {email, password} =
        this.getProperties('email', 'password');

      this.get('session').authenticate('authenticator:oauth2',
        email, password)
        .then(() => {
          this.set('email', '');
          this.set('password', '');
          this.get('currentUser').extractUserFromSession();
        })
        .catch(() => {
          this.set('errorMessage', {
              reason: "Your password or email is incorrect!"
          });
        });
    }
  }
});
