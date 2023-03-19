'use strict';

const sinon = require('sinon');

const commands = require('../../lib/commands');
const knexCacheUtils = require('../../lib/utils');

describe('#commands', () => {
  let cache;
  let key;
  let data;
  let knexQuery;

  beforeEach(() => {
    cache = {};
    key = 'key';
    data = 'data';
    knexQuery = Promise.resolve(data);

    sinon.stub(knexCacheUtils, 'set');
    sinon.stub(knexCacheUtils, 'unset');
    sinon.stub(knexCacheUtils, 'get');
  });

  describe('#cache', () => {
    let result;

    describe('when data is already cached', () => {
      let cachedData;

      beforeEach(async () => {
        cachedData = 'cachedData';
        knexCacheUtils.get.returns(cachedData);
        result = await commands.cache(cache, knexQuery, key);
      });

      it('should resolve with cached data', () => result.should.be.equal(cachedData));

      it('should get data from cache', () => knexCacheUtils.get.should.have.been.calledWith(cache, key));

      it('should not set data to cache', () => knexCacheUtils.set.should.not.been.called);
    });

    describe('when data is not cached', () => {
      beforeEach(async () => {
        knexCacheUtils.get.returns(undefined);
        result = await commands.cache(cache, knexQuery, key);
      });

      it('should resolve with data', () => result.should.be.equal(data));

      it('should get data from cache', () => knexCacheUtils.get.should.have.been.calledWith(cache, key));

      it('should set data to cache', () => knexCacheUtils.set.should.have.been.calledWith(cache, key, data));
    });
  });

  describe('#invalidate', () => {
    let result;

    describe('when data is already cached', () => {
      let cachedData;

      beforeEach(async () => {
        cachedData = 'cachedData';
        knexCacheUtils.get.returns(cachedData);
        result = await commands.invalidate(cache, knexQuery, key, {exact: true});
      });

      it('should get data from cache', () => knexCacheUtils.get.should.have.been.calledWith(cache, key));

      it('should unset data from cache', () => knexCacheUtils.unset.should.have.been.calledWith(cache, key, {exact: true}));

      it('should resolve knex query', () => result.should.be.equal(data));
    });

    describe('when data is not cached', () => {
      beforeEach(async () => {
        knexCacheUtils.get.returns(undefined);
        result = await commands.cache(cache, knexQuery, key);
      });

      it('should get data from cache', () => knexCacheUtils.get.should.have.been.calledWith(cache, key));

      it('should not unset data from cache', () => knexCacheUtils.unset.should.not.have.been.called);

      it('should resolve knex query', () => result.should.be.equal(data));
    });
  });
})
