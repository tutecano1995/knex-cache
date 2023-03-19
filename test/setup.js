const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

global.should = chai.should();

chai.use(sinonChai);

afterEach(function closeTest() {
  sinon.restore();
});
