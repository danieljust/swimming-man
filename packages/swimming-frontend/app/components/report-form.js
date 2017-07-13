import Ember from 'ember';

export default Ember.Component.extend({
  errorMessage: null,
  isDisabled: true,
  date: Ember.observer('modelDate', function() {
    if(this.get('modelDate').get() > new Date()){
      this.set('errorMessage', {
        message:'Date must be less than or equal to current date and time'
      });
      this.set('isDisabled', true);
    }
    else {
      this.set('errorMessage', null);
      this.set('isDisabled', false);
    }
  })
});
