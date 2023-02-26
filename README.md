# knex-cache

## Introduction

knex-cache is a knex extension for caching SQL queries results.

- `cache` query function intercepts the SQL query response and cache it in memory using a user defined key. If you perform multiple queries using the same key, only the first query will be executed and the next queries will return the cached result.

- `invalidate` query function invalidates cache entry associated to a user defined key. If you invalidate a key, any query using that same key will be executed.

## Installation

```js
nvm use
```

```js
npm i
```

## Example


```js
const knex = require('knex');
const knexCache = require('knexCache');

knexCache(knex);

await knexInstance.select().from('users').cache('users'); // Should execute the query
await knexInstance.select().from('users').cache('users'); // Should not execute the query and use cache

await knexInstance('users').update({username: 'tutecano22'}).where({id: 22}).invalidate('users'); // Invalidate users

await knexInstance.select().from('users').cache('users'); // Should execute the query
```
