const assert = require('assert'), ipBlacklist = require('../index'), path = require('path');
describe('ip-blacklist', function () {
    describe('#array()', function () {
        const cb = ipBlacklist.array(['127.0.0.1', '::1']);
        it('should return true when the ip is 127.0.0.1', () => assert.equal(true, cb('127.0.0.1')));
        it('should return true when the ip is ::1', () => assert.equal(true, cb('::1')));
        it('should return false when the ip is 127.0.0.2', () => assert.equal(false, cb('127.0.0.2')));
        it('should return false when the ip is ::2', () => assert.equal(false, cb('::2')));
    });
    describe('#file()', function () {
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