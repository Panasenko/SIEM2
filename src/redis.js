const redis = require("redis")
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)
//const logger = require('./logger')

module.exports = function (app) {

  const client = redis.createClient(app.get('redisConf'))


  client.on("error", function (err) {
    console.log("Errorss " + err)
  })

  app.set('redis', client)
}
