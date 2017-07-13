import Ember from 'ember';
import scrollingMixin from '../mixins/scrolling'

export default Ember.Component.extend(scrollingMixin,{
  didInsertElement() {
    this.bindScrolling();
  },
  willClearRender() {
    this.unbindScrolling();
  },
  scrolled() {
    this._super();
    this.set('condition', window.innerHeight/2 < window.scrollY);
  }
});

