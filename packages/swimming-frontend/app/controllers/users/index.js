import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  currentUser: service('current-user'),
  condition: false
});
