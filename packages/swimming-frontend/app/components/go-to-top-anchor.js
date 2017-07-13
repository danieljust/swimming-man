import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    goToTop(){
      this._super();
      window.$('html,body').animate({ scrollTop: 0 }, 'slow');
      return true;
    }
  }
});
