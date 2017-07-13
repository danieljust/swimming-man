import Ember from 'ember';
import { Ability } from 'ember-can';

export default Ability.extend({
  // canCreate: Ember.computed(function() {
  //   return this.get('model.permissions.canCreate');
  // }),
  canEdit: Ember.computed(function() {
    return this.get('model.permissions.canEdit');
  }),
  canDelete: Ember.computed(function() {
    return this.get('model.permissions.canDelete');
  })
});
