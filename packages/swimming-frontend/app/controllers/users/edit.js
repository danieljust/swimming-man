import Ember from 'ember';
import errorProcessor from '../../utils/error-processor';

const {service} = Ember.inject;

export default Ember.Controller.extend({
  ajax: service(),
  session: service(),
  currentUser: service('current-user'),
  responseMessage: '',
  errorMessage: '',
  isSaved: null,
  isAdmin: Ember.computed('currentUser', function(){
    return this.get('currentUser').getProperty('isAdmin');
  }),
  canViewUsers: Ember.computed('currentUser', function(){
    return this.get('currentUser').getProperty('canViewUsers');
  }),
  notMyself: function(){
    return this.get('currentUser').getProperty('userId') !== this.get('model.id')
  }.property('currentUser', 'model.id'),
  actions: {
    promote(model){
      return this.get('ajax').request('api/position', {
        method: 'PUT',
        data: {
          userId: model.id,
          position: 'manager'
        }
      }).then(() => {
          this.set('isSaved', true);
          this.set('responseMessage', 'User has been successfully promoted to manager');
          model.reload();
      })
        .catch(error => {
          const Error = errorProcessor(error);
          this.set('errorMessage', Error)
        });
    },
    demote(model){
      return this.get('ajax').request('api/position', {
        method: 'DELETE',
        data: {
          userId: model.id,
          position: 'manager'
        }
      }).then(() => {
          this.set('isSaved', true);
          this.set('responseMessage', 'User has been successfully demoted from manager');
        model.reload();
        })
        .catch(error => {
          model.reload();
          const Error = errorProcessor(error);
          this.set('errorMessage', Error)
        });
    },
    saveUser(editedUser) {
      editedUser.save()
        .then(() => {
            this.set('isSaved', true);
            this.set('responseMessage', 'Saved');
            const session = this.get('session');
            if (this.get('currentUser').getProperty('userId') === editedUser.id && session.isAuthenticated) {
              const username = editedUser.get('firstName') + ' ' + editedUser.get('lastName');
              this.get('currentUser').updateUser('username', username);
              this.transitionToRoute(this.get('router.currentRouteName'));
            }
        })
        .catch(error => {
        const Error = errorProcessor(error);
        this.set('errorMessage', Error)
      });
    }
  }
});
