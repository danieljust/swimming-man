import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized/1000;
  },

  serialize(deserialized) {
    return deserialized*1000;
  }
});
