const knex = require('knex');
const knexCache = require('../lib/knexCache');
const knexMock = require('mock-knex');
const { expect } = require('chai');

describe('#knexCache', () => {
  let knexInstance;
  let tracker;
  let dbQueries;

  before(() => {
    knexCache(knex);
  })

  beforeEach(() => {
    dbQueries = {};

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
  })

  describe('when caching query', () => {
    beforeEach(async () => {
      await knexInstance.select().from('users').cache('users'); // Should execute the query
      await knexInstance.select().from('users').cache('users'); // Should not execute the query and use cache
    });

    it('should execute the query once', () => expect(dbQueries['select * from "users"']).be.equal(1));

    describe('when invalidating query', () => {
      beforeEach(async () => {
        await knexInstance('users').update({username: 'tutecano22'}).invalidate('users');
        await knexInstance.select().from('users').cache('users'); // Should execute the query after invalidation
      });

      it('should execute the update', () => expect(dbQueries['update "users" set "username" = $1']).be.equal(1));

      it('should execute the query after invalidation', () => expect(dbQueries['select * from "users"']).be.equal(1));
    });
  });
})
