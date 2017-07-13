import { newlineEnabler } from 'swimming-frontend/helpers/newline-enabler';
import { module, test } from 'qunit';

module('Unit | Helper | newline enabler');

test('Output string contains ', function(assert) {
    let inputString = '123\n ......er erer \n qwerty\n 1gn\n';
    let countBefore = (inputString.match(/\\n/g) || []).length;
    let outputString = newlineEnabler(inputString).toString();
    let countAfter = (outputString.match(/<br>/g) || []).length;
    assert.equal(countBefore, countAfter);
});
