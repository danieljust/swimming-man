import Ember from 'ember';

export default Ember.Component.extend({
  isAdmin: Ember.computed('currentUser', 'user', function () {
    return this.get('currentUser').getProperty('isAdmin')
  })
});
