'use strict';

const utils = require('../../lib/utils');
const { expect } = require('chai');

describe('#utils', () => {
  let cache;
  let key;

  beforeEach(() => {
    cache = {
      users: {
        value: [{id: 0}, {id: 1}],
        children: {
          0: {
            value: {id: 0},
          },
          1: {
            value: {id: 1},
          }
        }
      }
    };
  });

  describe('#get', () => {
    let result;

    describe('when getting by simple key', () => {
      beforeEach(async () => {
        key = 'users';
        result = utils.get(cache, key);
      });

      it('should get the expected value', () => result.should.be.equal(cache.users.value));
    });

    describe('when getting by nested key', () => {
      beforeEach(async () => {
        key = 'users.0';
        result = utils.get(cache, key);
      });

      it('should get the expected value', () => result.should.be.equal(cache.users.children['0'].value));
    });

    describe('when getting by non chached key', () => {
      beforeEach(async () => {
        key = 'users.22';
        result = utils.get(cache, key);
      });

      it('should return undefined', () => expect(result).to.be.undefined);
    });
  });

  describe('#set', () => {
    let data;

    describe('when setting by simple key', () => {
      describe('when key does not exist', () => {
        beforeEach(async () => {
          key = 'courses';
          data = [{id: 22}];
          utils.set(cache, key, data);
        });
  
        it('should set value in the cache', () => cache.courses.value.should.be.equal(data));
      });

      describe('when key exists', () => {
        beforeEach(async () => {
          key = 'users';
          data = [{id: 22}];
          utils.set(cache, key, data);
        });
  
        it('should set value in the cache', () => cache.users.value.should.be.equal(data));
      });
    });

    describe('when setting by nested key', () => {
      describe('when key does not exist', () => {
        beforeEach(async () => {
          key = 'users.22';
          data = {id: 22};
          utils.set(cache, key, data);
        });
  
        it('should set value in the cache', () => cache.users.children['22'].value.should.be.equal(data));
      });

      describe('when key exists', () => {
        beforeEach(async () => {
          key = 'users.0';
          data = {id: 22};
          utils.set(cache, key, data);
        });
  
        it('should set value in the cache', () => cache.users.children['0'].value.should.be.equal(data));
      });
    });

  });

  describe('#unset', () => {
    describe('when unsetting by simple key', () => {
      describe('when using exact parameter', () => {
        beforeEach(() => {
          key = 'users';
          utils.unset(cache, key, {exact: true});
        });

        it('should remove the value', () => expect(cache.users.value).to.be.undefined);

        it('should not remove the children', () => expect(cache.users.children).not.to.be.undefined);
      });

      describe('when not using exact parameter', () => {
        beforeEach(() => {
          key = 'users';
          utils.unset(cache, key);
        });
  
        it('should remove the value and the children', () => expect(cache.users).to.be.undefined);
      });
    });

    describe('when unsetting by nested ket', () => {
      beforeEach(() => {
        key = 'users.0';
        utils.unset(cache, key);
      });

      it('should remove the value', () => expect(cache.users.children['0']).to.be.undefined);
    });
  });
})
