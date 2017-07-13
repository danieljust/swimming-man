import Ember from 'ember';
import { Ability } from 'ember-can';

export default Ability.extend({
  canEdit: Ember.computed(function() {
    return this.get('model.permissions.canEdit');
  }),
  canChangeRole: Ember.computed(function() {
    return this.get('model.permissions.canChangeRole');
  }),
  canViewTrainings: Ember.computed(function() {
    return this.get('model.permissions.canViewTrainings');
  }),
  canCreateTraining: Ember.computed(function() {
    return this.get('model.permissions.canCreateTraining');
  })
});
