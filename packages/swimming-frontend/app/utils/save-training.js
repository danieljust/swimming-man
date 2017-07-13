import {task} from 'ember-concurrency';
import errorProcessor from './error-processor';

export default function saveTraining() {
  return task(function *(training) {
    training.set('duration', {
      hours: training.get('hours'),
      minutes: training.get('minutes')
    });
    yield training.save()
      .then(
        () => {
          this.transitionToRoute('trainings');
        })
      .catch(error => {
          const Error = errorProcessor(error);
          this.set('errorMessage', Error);
        });
  })
}
