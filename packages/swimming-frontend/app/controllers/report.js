import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['afterDate', 'userId'],
  afterDate: null,
  userId: null,
  responseMessage:'',
  isLoaded: false,
});
