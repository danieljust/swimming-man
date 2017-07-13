import { averageVelocity } from 'swimming-frontend/helpers/average-velocity';
import { module, test } from 'qunit';

module('Unit | Helper | average velocity');

test('should return division by zero', function(assert) {
    let namedArgs = {
        duration: {
            hours: 0,
            minutes: 0
        },
        distance: 166
    }
    let result = averageVelocity([42], namedArgs);
    assert.equal('Error: Division by zero', result)
});

test('should calculate average velocity', function(assert) {
    let namedArgs = {
        duration: {
            hours: 23,
            minutes: 16
        },
        distance: 166
    }
    let result = averageVelocity([42], namedArgs);
    assert.notEqual(result, 0);
});
