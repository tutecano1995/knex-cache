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
  _.set(cache, `${cacheKey}.value`, data); // Set value
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

module.exports = function knexCache(knex) {
  let cache = {};

  knex.QueryBuilder.extend('cache', function (key) {
    let data = get(cache, key);
    if(data) {
      return Promise.resolve(data);
    }
    return this.then(data => {
      set(cache, key, data);
      return data;
    });
  });

  knex.QueryBuilder.extend('invalidate', function (key, { exact = false } = {}) {
    if(get(cache, key)) {
      unset(cache, key, { exact });
    }
    return this;
  });
}
