var expect = require('chai').expect;
var request = require('request');

describe('Server', () => {
  it('game endpoint', (done) => {
    request.put('http://localhost:3000/game', function (error, response, body) {
      expect(body).to.not.be.null;
      done();
    });
  });
});