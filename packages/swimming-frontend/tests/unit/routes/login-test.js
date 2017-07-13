import { moduleFor, test } from 'ember-qunit';

moduleFor('route:login', 'Unit | Route | login', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('visiting /login', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
