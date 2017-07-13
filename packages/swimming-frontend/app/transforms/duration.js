import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    return {
      hours: Math.floor(serialized/3600),
      minutes: Math.floor(serialized%3600/60)
    };
  },

  serialize(deserialized) {
    return deserialized.hours*3600+deserialized.minutes*60;
  }
});
