import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  session: Ember.inject.service('session'),
  headers: Ember.computed('session', {
    get() {
      let headers = {};
      const authToken = this.get('session.data.authenticated.access_token');
      if (authToken) {
        headers['Authorization'] = 'Bearer ' + authToken;
      }
      return headers;
    }
  })
});
