import Ember from 'ember';

export function averageVelocity(params, namedArgs) {
  const duration = namedArgs.duration.hours + namedArgs.duration.minutes / 60;
  if(duration === 0) {
    return 'Error: Division by zero';
  }
  else {
    return (namedArgs.distance / duration).toFixed(2) + ' km/h';
  }
}

export default Ember.Helper.helper(averageVelocity);
