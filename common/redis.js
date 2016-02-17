var Redis = require('ioredis');

/**
 * [client description]
 * @type {Redis}
 */
var client = new Redis({
  port: 6379,
  host: '127.0.0.1',
  db: 0,
});

exports = module.exports = client;