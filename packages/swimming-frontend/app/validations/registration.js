import {
  validateLength,
  validateFormat,
  validateConfirmation
} from 'ember-changeset-validations/validators';

export default {
  email: [
    validateFormat({ regex: /^.+@.+\..+$/})
  ],
  firstName: [
  ],
  lastName: [
  ],
  password: [
    validateLength({ min: 6 })
  ],
  confirmPassword: [
    validateConfirmation({ on: 'password' })
  ]
};
