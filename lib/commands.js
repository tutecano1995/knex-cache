'use strict';

const knexCacheUtils = require('./utils');

function cache(cache, knexQuery, key) {
  let data = knexCacheUtils.get(cache, key);
  if(data) {
    return Promise.resolve(data);
  }
  return knexQuery.then(data => {
    knexCacheUtils.set(cache, key, data);
    return data;
  });
}

function invalidate(cache, knexQuery, key, { exact = false } = {}) {
  if(knexCacheUtils.get(cache, key)) {
    knexCacheUtils.unset(cache, key, { exact });
  }
  return knexQuery;
}

module.exports = {
  cache,
  invalidate
};

