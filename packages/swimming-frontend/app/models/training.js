import DS from 'ember-data';

export default DS.Model.extend({
  date: DS.attr(),
  duration: DS.attr('duration'),
  distance: DS.attr('distance'),
  description: DS.attr('string'),
  userId: DS.attr('string'),
  permissions:{
    canEdit:DS.attr(),
    canCreate:DS.attr(),
    canDelete:DS.attr()
  }
});
