import DS from 'ember-data';

export default DS.Model.extend({
  totalDistance: DS.attr('distance'),
  averageDistance: DS.attr('distance'),
  averageDuration: DS.attr('duration'),
  quantity: DS.attr('number')
});
