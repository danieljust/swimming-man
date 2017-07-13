import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:trainings/index', 'Unit | Controller | trainings/index', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('scrolled', function(assert) {
  let controller = this.subject();
  controller.send('scrolled');
  assert.equal(controller.get('condition'), false);
});

// test('should delete training', function(assert) {
//   let controller = this.subject();
// });
