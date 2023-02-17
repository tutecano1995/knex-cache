const knex = require('knex');
const knexCache = require('../lib/knexCache');
const knexMock = require('mock-knex');
const { expect } = require('chai');

knexCache(knex);

describe('#knexCache', () => {
  let knexInstance;
  let tracker;
  let dbQueries;

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
        {id: 0, username: 'tutecaon1995', }
      ]);
    });
  });

  afterEach(() => {
    knexMock.unmock(knexInstance);
    tracker.uninstall();
  })

  describe('when caching query', () => {
    beforeEach(async () => {
      await knexInstance.select().from('users').cache('users'); // This should go to the DB
      await knexInstance.select().from('users').cache('users'); // This should not go to the DB
    });

    it('should execute the query once', () => expect(dbQueries).be.equal(1));
  });

  describe.only('when invalidating query', () => {
    beforeEach(async () => {
      await knexInstance.select().from('users').cache('users'); // This should go to the DB
      await knexInstance.select().from('users').cache('users'); // This should not go to the DB
      await knexInstance('users').update({username: 'tutecano22'}).invalidate('users');
      await knexInstance.select().from('users').cache('users'); // This should go to the DB
    });

    it('should execute the query twice', () => expect(dbQueries['select * from \"users\"']).be.equal(2));

    it('should execute the update once', () => expect(dbQueries['update "users" set "username" = $1']).be.equal(1));
  });
})
