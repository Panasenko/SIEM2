const _ = require('lodash')
exports.Redis = class Redis {
  constructor(options) {
    this.driver = options
  }

  async hgetall(id) {
    if(_.isString(id)){
      return await this.driver.redis.hgetallAsync(id).then(result => {
          return result
        },
        err => {
          throw new Error(err)
        })
    } else {
      throw new Error("invalid request parameters")
    }

  }

  async hmset(id, data) {
    if (_.isObject(data)) {
      return await this.driver.redis.HMSETAsync(id, data).then(result => {
          return result
        },
        err => {
          throw new Error(err)
        })
    } else {
      throw new Error("invalid request parameters")
    }

  }

  async remove(id) {
    if(_.isString(id)){
      return this.driver.redis.delAsync(id).then(result => {
          return result
        },
        err => {
          throw new Error(err)
        })
    } else {
      throw new Error("invalid request parameters")
    }
  }
};
