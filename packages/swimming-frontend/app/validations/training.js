import {
  validateNumber,
  validatePresence,
  validateFormat
} from 'ember-changeset-validations/validators';
import validateTime from '../validators/time';

export default {
  hours: [
    validateNumber({
      positive: true
    }),
    validateFormat({
      regex: /^[0-9]+(\.[0-9]{1,2})?$/
    })
  ],
  minutes: [
    validateNumber({
      integer: true,
      positive: true
    }),
    validateFormat({
      regex: /^[0-9]+$/
    })
  ],
  distance: [
    validateNumber({
      positive: true
    }),
    validateFormat({
      regex: /^[0-9]+(\.[0-9]{1,2})?$/
    })
  ],
  date: [
    validatePresence(true),
    validateTime()
  ]
};
