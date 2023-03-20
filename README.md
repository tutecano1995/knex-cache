# knex-cache

[![Coverage Status](https://coveralls.io/repos/github/tutecano1995/knex-cache/badge.svg?branch=docs/readme)](https://coveralls.io/github/tutecano1995/knex-cache?branch=docs/readme)

## Introduction

knex-cache is a knex extension for caching SQL queries results.

- `cache` query function intercepts the SQL query response and cache it in memory using a user defined key. If you perform multiple queries using the same key, only the first query will be executed and the next queries will return the cached result.

- `invalidate` query function invalidates cache entry associated to a user defined key. If you invalidate a key, any query using that same key will be executed.

## Installation

```
npm i @tutecano1995/knex-cache
```

## Example

## Simple keys

```js
const knex = require('knex');
const knexCache = require('@tutecano1995/knex-cache');

knexCache(knex);

await knexInstance.select().from('users').cache('users'); // Should execute the query
await knexInstance.select().from('users').cache('users'); // Should not execute the query and use cache

await knexInstance('users').update({username: 'tutecano22'}).where({id: 22}).invalidate('users'); // Invalidate users

await knexInstance.select().from('users').cache('users'); // Should execute the query
```


## Nested keys

```js
const knex = require('knex');
const knexCache = require('@tutecano1995/knex-cache');

knexCache(knex);

await knexInstance.select().from('users').cache('users'); // Should execute the query
await knexInstance.select().from('users').where({id: 22}).cache('users.22'); // Should execute the query and cache the chid key
await knexInstance.select().from('users').where({id: 22}).cache('users.15'); // Should execute the query and cache the chid key

await knexInstance('users').update({name: 'test'}).invalidate('users'); // Invalidate users and all children

await knexInstance.select().from('users').cache('users'); // Should execute the query
await knexInstance.select().from('users').where({id: 22}).cache('users.22'); // Should execute the query and cache the chid key
await knexInstance.select().from('users').where({id: 22}).cache('users.15'); // Should execute the query and cache the chid key

await knexInstance('users').update({name: 'test'}).invalidate('users', {exact: true}); // Invalidate only users

await knexInstance.select().from('users').cache('users'); // Should execute the query
await knexInstance.select().from('users').where({id: 22}).cache('users.22'); // Should not execute the query and use cache
await knexInstance.select().from('users').where({id: 22}).cache('users.15'); // Should not execute the query and use cache
```
