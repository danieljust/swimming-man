import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('user.js-edit-modal-window', 'Integration | Component | user.js.js edit modal window', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{user-edit-modal-window}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#user-edit-modal-window}}
      template block text
    {{/user-edit-modal-window}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
