import Ember from 'ember';

export default Ember.Component.extend({
  user: Ember.computed('currentUser.data.{userId,username,canViewUsers,isAdmin}', function () {
    return{
      userId: this.get('currentUser').getProperty('userId'),
      username: this.get('currentUser').getProperty('username'),
      canViewUsers: this.get('currentUser').getProperty('canViewUsers'),
      isAdmin: this.get('currentUser').getProperty('isAdmin')
    }
  })
});
