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

function unset(cache, key) {
  const fields = key.split('.');
  const cacheKey = fields.join('.children.');
  _.unset(cache, `${cacheKey}`); // Remove both children and value
}

module.exports = function knexCache(knex) {
  let cache = {};

  knex.QueryBuilder.extend('cache', async function (key) {
    try {
      let data = get(cache, key);
      if(data) {
        return data;
      }
      data = await this;
      set(cache, key, data);
      return data;
    } catch (e) {
      throw new Error(e);
    }
  });

  knex.QueryBuilder.extend('invalidate', async function (key) {
    try {
      if(get(cache, key)) {
        unset(cache, key);
      }
      const data = await this;
      return data
    } catch (e) {
      throw new Error(e);
    }
  });
}
