import Ember from 'ember';

export default Ember.Mixin.create({
  _scrollHandler() {
    let _this = this;
    return Ember.run.debounce(function() { return _this.scrolled(); }, 100);
  },
  bindScrolling() {
    let scrollHandler;
    scrollHandler = this._scrollHandler.bind(this);
    Ember.$(window).on('scroll.scrollable', scrollHandler);
  },
  unbindScrolling() {
    Ember.$(window).off('.scrollable');
  }
});
