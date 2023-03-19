'use strict';

const _ = require('lodash');

function get(cache, key) {
  const fields = key.split('.');
  const cacheKey = fields.join('.children.');
  return _.get(cache, `${cacheKey}.value`); // Get value
}

function set(cache, key, data) {
  const fields = key.split('.');
  const cacheKey = fields.join('.children.');
  _.setWith(cache, `${cacheKey}.value`, data, Object); // Set value
}

function unset(cache, key, { exact } = {}) {
  const fields = key.split('.');
  let cacheKey = fields.join('.children.');
  // If exact is true remove only value
  if (exact) {
    cacheKey = `${cacheKey}.value`;
  }
  _.unset(cache, `${cacheKey}`);
}

module.exports = {
  get,
  set,
  unset
};
