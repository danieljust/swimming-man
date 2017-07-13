import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Service.extend({
  data: null,
  session: service('session'),

  init() {
    this._super(...arguments);
    this.set('data', {});
  },
  getProperty(key){
    return this.get(`data.${key}`);
  },
  extractUserFromSession(){
      const sessionData = this.get('session.data.authenticated.user');
      const isAdmin = sessionData.positions.includes('admin');
      const isManager = sessionData.positions.includes('manager');
      const canViewUsers = isManager || isAdmin;
      this.set('data', {
        userId: sessionData.id,
        canViewUsers: canViewUsers,
        username: sessionData.username,
        isAdmin: isAdmin,
        isManager: isManager
      });
  },
  updateUser(key, value) {
    this.set(`data.${key}`, value);
    this.get('session').set('data.authenticated.user.username', value);
  }
});
