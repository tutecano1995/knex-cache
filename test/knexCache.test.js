const knexCache = require('../lib/knexCache');
const knexMock = require('mock-knex');
const { expect } = require('chai');
const decache = require('decache');

describe('#knexCache', () => {
  let knexInstance;
  let tracker;
  let dbQueries;
  let knex;

  beforeEach(() => {
    dbQueries = {};

    knex = require('knex');
    knexCache(knex);

    knexInstance = knex({
      client: 'pg'
    });

    knexMock.mock(knexInstance);
    tracker = knexMock.getTracker();
    tracker.install();
    tracker.on('query', (query) => {
      dbQueries[query.sql] = (dbQueries[query.sql] || 0) + 1;
      query.response([
        {id: 0, username: 'tutecano1995', }
      ]);
    });
  });

  afterEach(() => {
    knexMock.unmock(knexInstance);
    tracker.uninstall();
    decache('knex');
  })

  describe('#cache', () => {
    describe('simple key', () => {
      beforeEach(async () => {
        await knexInstance.select().from('users').cache('users'); // Should execute the query
        await knexInstance.select().from('users').cache('users'); // Should not execute the query and use cache
      });

      it('should execute the query once', () => expect(dbQueries['select * from "users"']).be.equal(1));
    });

    describe('nested keys', () => {
      beforeEach(async () => {
        await knexInstance.select().from('users').cache('users'); // Should execute the query
        await knexInstance.select().from('users').cache('users'); // Should not execute the query and use cache
        await knexInstance.select().from('users').where({id: 22}).cache('users.22'); // Should execute the query
        await knexInstance.select().from('users').where({id: 22}).cache('users.22'); // Should not execute the query and use cache
      });

      it('should execute the parent query once', () => expect(dbQueries['select * from "users"']).be.equal(1));

      it('should execute the child query once', () => expect(dbQueries['select * from "users" where "id" = $1']).be.equal(1));
    });
  });

  describe('#invalidate', () => {
    describe('simple key', () => {
      beforeEach(async () => {
        await knexInstance.select().from('users').cache('users'); // Should execute the query
        await knexInstance('users').update({username: 'tutecano22'}).invalidate('users');
        await knexInstance.select().from('users').cache('users'); // Should execute the query after invalidation
      });

      it('should execute the update', () => expect(dbQueries['update "users" set "username" = $1']).be.equal(1));

      it('should execute the query after invalidation', () => expect(dbQueries['select * from "users"']).be.equal(2));
    });

    describe('nested keys', () => {
      describe('invalidating parent key', () => {
        beforeEach(async () => {
          await knexInstance.select().from('users').cache('users'); // Should execute the query
          await knexInstance.select().from('users').where({id: 22}).cache('users.22'); // Should execute the query
          await knexInstance('users').update({username: 'tutecano22'}).invalidate('users');
          await knexInstance.select().from('users').cache('users'); // Should execute the query after invalidation
          await knexInstance.select().from('users').where({id: 22}).cache('users.22'); // Should execute the query after invalidation
        });

        it('should execute the update', () => expect(dbQueries['update "users" set "username" = $1']).be.equal(1));

        it('should execute the parent query twice', () => expect(dbQueries['select * from "users"']).be.equal(2));

        it('should execute the child query twice', () => expect(dbQueries['select * from "users" where "id" = $1']).be.equal(2));
      });

      describe('invalidating child key', () => {
        beforeEach(async () => {
          await knexInstance.select().from('users').cache('users'); // Should execute the query
          await knexInstance.select().from('users').where({id: 22}).cache('users.22'); // Should execute the query
          await knexInstance('users').update({username: 'tutecano22'}).where({id: 22}).invalidate('users.22');
          await knexInstance.select().from('users').cache('users'); // Should not execute the query and use cache
          await knexInstance.select().from('users').where({id: 22}).cache('users.22'); // Should execute the query after invalidation
        });

        it('should execute the update', () => expect(dbQueries['update "users" set "username" = $1 where "id" = $2']).be.equal(1));

        it('should execute the parent query once', () => expect(dbQueries['select * from "users"']).be.equal(1));

        it('should execute the child query twice', () => expect(dbQueries['select * from "users" where "id" = $1']).be.equal(2));
      });
    });
  });
})
