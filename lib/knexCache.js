'use strict';

const _ = require('lodash');
const commands = require('./commands');

module.exports = function knexCache(knex) {
  let cache = {};

  knex.QueryBuilder.extend('cache', function (key) {
    return commands.cache(cache, this, key);
  });

  knex.QueryBuilder.extend('invalidate', function (key, options={}) {
    return commands.invalidate(cache, this, key, options);
  });
}
