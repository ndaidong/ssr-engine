/**
 * Testing
 * @ndaidong
 */

const test = require('tape');

const {
  hasProperty,
  isObject,
  isFunction,
} = require('bellajs');

const main = require('../../index');

const publicMethods = [
  'configure',
  'getConfig',
  'start',
];

test('Check exported object', (assert) => {
  assert.ok(isObject(main), 'Exported object must be an object');
  assert.ok(hasProperty(main, 'version'), 'Exported object must have version');
  publicMethods.forEach((meth) => {
    assert.ok(isFunction(main[meth]), `Exported object must have public method ".${meth}()"`);
  });
  assert.end();
});
