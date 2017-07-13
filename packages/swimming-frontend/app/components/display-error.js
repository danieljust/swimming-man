import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    resetError(){
      this.set('errorMessage', null);
    },
    resetSuccess(){
      this.set('isLoaded', false);
      this.set('responseMessage', null);
    }
  }
});
