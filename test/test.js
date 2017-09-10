const assert = require('assert'),
  expect = require('expect.js'),
  ipBlacklist = require('../index'),
  path = require('path');

describe('ip-blacklist', function() {
  it('should expose a function', () => expect(ipBlacklist).to.be.a('function'));
  describe('middleware', function() {
    it('should fallback to req.socket.remoteAddress if req.ip is not set', function(done) {
      const middleware = ipBlacklist(ip => ip == '127.0.0.15');

      const req = {
        socket: {
          remoteAddress: '127.0.0.15'
        }
      };
      const res = {
        statusCode: 200,
        end: function(msg) {
          expect(msg).to.be('IP is blacklisted');
          expect(res.statusCode).to.be(403);
          done();
        }
      };

      middleware(req, res, function() {
        expect().fail('next() should not be called');
      });
    });
    it('should call next middleware', function(done) {
      const middleware = ipBlacklist(ipBlacklist.array(['127.0.0.1']));
      middleware({
        ip: '127.0.0.2'
      }, {}, function() {
        done();
      });
    });
    it('should end request with code 403', function(done) {
      const middleware = ipBlacklist(ipBlacklist.array(['127.0.0.1']));
      const res = {
        statusCode: 200,
        end: function(msg) {
          expect(msg).to.be('IP is blacklisted');
          expect(res.statusCode).to.be(403);
          done();
        }
      };
      middleware({
        ip: '127.0.0.1'
      }, res, function() {
        expect().fail('Should not call next() here');
      });
    })
  });
  describe('#array()', function() {
    const cb = ipBlacklist.array(['127.0.0.1', '::1', 'i am not an ip address']);
    it('should return true when the ip is 127.0.0.1', () => assert.equal(true, cb('127.0.0.1')));
    it('should return true when the ip is ::1', () => assert.equal(true, cb('::1')));
    it('should return false when the ip is 127.0.0.2', () => assert.equal(false, cb('127.0.0.2')));
    it('should return false when the ip is ::2', () => assert.equal(false, cb('::2')));
    it('should filter out invalid IP addresses', function() {
      expect(cb('i am not an ip address')).to.be(false);
    });
  });
  describe('#file()', function() {
    const cb = ipBlacklist.file(path.join(__dirname, 'ips.txt'));
    it('should return true when the ip is 127.0.0.1', () => assert.equal(true, cb('127.0.0.1')));
    it('should return true when the ip is ::1', () => assert.equal(true, cb('::1')));
    it('should return false when the ip is 127.0.0.2', () => assert.equal(false, cb('127.0.0.2')));
    it('should return false when the ip is ::2', () => assert.equal(false, cb('::2')));
  });
  describe('#chain()', () => {
    const cb = ipBlacklist.chain(
      ipBlacklist.file(path.join(__dirname, 'ips.txt')),
      ipBlacklist.array(['127.0.0.3', '::3'])
    );
    it('should return true when the ip is 127.0.0.1', () => assert.equal(true, cb('127.0.0.1')));
    it('should return true when the ip is ::1', () => assert.equal(true, cb('::1')));
    it('should return false when the ip is 127.0.0.2', () => assert.equal(false, cb('127.0.0.2')));
    it('should return false when the ip is ::2', () => assert.equal(false, cb('::2')));
    it('should return true when the ip is 127.0.0.3', () => assert.equal(true, cb('127.0.0.3')));
    it('should return true when the ip is ::3', () => assert.equal(true, cb('::3')));
  });
});
