import Ember from 'ember';

export default Ember.Component.extend({
  currentItem: null,
  notSet: true,
  notChecked: true,
  actions: {
    checkItem(item) {
      this.set('currentItem', item);
      this.get('itemAction')(item.params);
    }
  },
  didReceiveAttrs() {
    if (this.get('notChecked')){
      const items = this.get('items');
      const firstItemIndex = items.map(function(item) { return item.params; }).indexOf(this.get('firstItem'));
      const currentItem = items[firstItemIndex];
      this.set('notChecked', false);
      this.set('currentItem', currentItem);
    }
  }
});
