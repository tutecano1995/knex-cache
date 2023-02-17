'use strict';

module.exports = function knexCache(knex) {

  let cache = {};

  knex.QueryBuilder.extend('cache', async function (key) {
    try {
      if(cache[key]) { 
        return cache[key];
      }
      const data = await this;
      cache[key] = data;
      return data;
    } catch (e) {
      throw new Error(e);
    }
  });

  knex.QueryBuilder.extend('invalidate', async function (key) {
    try {
      if(cache[key]) { 
        delete cache[key];
      }
      const data = await this;
      return data
    } catch (e) {
      throw new Error(e);
    }
  });
}
