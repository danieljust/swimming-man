import Ember from 'ember';

export function newlineEnabler(params) {
  return Ember.String.htmlSafe(params[0].replace(/\n/g, '<br>'));
}

export default Ember.Helper.helper(newlineEnabler);
