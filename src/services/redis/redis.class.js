const _ = require('lodash')
exports.Redis = class Redis {
  constructor(options) {
    this.driver = options
  }

  async get(id) {
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

  async create(data) {
    if (_.isObject(data)) {
      return await this.driver.redis.HMSET(data.id, data)
    } else {
      throw new Error("invalid request parameters")
    }

  }

  async remove(id) {
    if(_.isString(id)){
      return this.driver.redis.del(id)
    } else {
      throw new Error("invalid request parameters")
    }
  }
};
