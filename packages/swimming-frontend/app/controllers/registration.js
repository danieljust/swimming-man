import Ember from 'ember';
import registrationValidations from '../validations/registration';
import errorProcessor from '../utils/error-processor';
import { task } from 'ember-concurrency';

export default Ember.Controller.extend({
  registrationValidations,
  submit: task(function * (newUser) {
    yield newUser.save()
      .then(() => this.transitionToRoute('login'))
      .catch((error) =>
      {
        const Error = errorProcessor(error);
        this.set('errorMessage', Error)
      });
  })
});
