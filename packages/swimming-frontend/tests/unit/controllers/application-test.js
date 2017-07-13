import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:application', 'Unit | Controller | application', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('logout', function(assert) {
  let controller = this.subject();
  controller.send('logout');
  assert.equal(controller.get('session'), null);
});
