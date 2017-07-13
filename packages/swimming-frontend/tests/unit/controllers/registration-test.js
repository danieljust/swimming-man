import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:registration', 'Unit | Controller | registration', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it will transition to route login', function(assert) {
  let controller = this.subject();
  controller.send('submit');
  assert.equal(currentURL(), 'login');
});
