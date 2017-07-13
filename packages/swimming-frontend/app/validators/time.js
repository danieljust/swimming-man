import Ember from 'ember';
export default function validateUniqueness() {
  return (key, newValue, oldValue, changes, content) => {
    return new Ember.RSVP.Promise((resolve) => {
      resolve(new Date(newValue) < new Date() || 'Date must be less than or equal to current date and time');
    });
  };
}
