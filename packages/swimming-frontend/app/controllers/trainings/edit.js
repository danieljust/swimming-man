import Ember from 'ember';
import trainingValidations from '../../validations/training';
import save from '../../utils/save-training';

export default Ember.Controller.extend({
  trainingValidations,
  submit: save()
});
