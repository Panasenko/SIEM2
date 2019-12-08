const _ = require('lodash')

module.exports = class History {
  constructor(service) {
    this.service = service
  }

  history({_id, url, token}) {
    return new Promise(async (resolve, reject) => {

      if (_.isUndefined(_id) || _.isUndefined(url) || _.isUndefined(token)) {
        reject("params is empty")
      }

      resolve(await this.conveyor({
        zabbixCli_ID: _id,
        url: url,
        token: token
      }))

    })
  }

  conveyor(task) {

    return new Promise(async resolve => {
      let result = await this.service.redis.rget(this.generete_rid(task))

      if (_.isNull(result)) {
        resolve(Object.assign(task, {
          lastTime: Date.now() / 1000 | 0
        }))
      } else {
        resolve(Object.assign(task, result))
      }

    })

      .then(async task => {
        task.items = await this.getItems(task)
        return task
      })

      .then(async task => {
        task.items_array = await this.itemsToArr(task)
        return task
      })

      .then(async task => {
        task.res_history = _.flatten(await this.iterator(task))
        task.lastTime = Date.now() / 1000 | 0
        return task
      })

      .then(task => {
        let {items, res_history} = task
        task.enrichment_items = this.enrichment(items, res_history)
        return task
      })

      .then(async task => {
        task.handler = await this.handler(task)
        return task
      })

      .then(async task => {
        let {zabbixCli_ID, url, token, lastTime , items_array} = task
        task.redis = await this.redis_set(this.generete_rid(task), {zabbixCli_ID, url, token, lastTime , items_array})
        return task
      })


      .catch(err => this.errorHandler(err))
  }

  generete_rid({zabbixCli_ID}) {
    return `${zabbixCli_ID}:worker:history`
  }

  async redis_set(id, data) {
    let result = await this.service.redis.rset(id, data)
    if (!result) {
      return new Error("err create params to redis")
    }
    return data
  }

 async getItems(task) {
    return await this.service.itemsDB.find({query: {zabbixCli_ID: task.zabbixCli_ID}})
  }

  itemsToArr(task) {
    return _.reduce(task.items, (accumulator, value) => {
      accumulator[+value.value_type].push(value.itemid)
      return accumulator
    }, [[], [], [], [], []])
  }

  async iterator(task) {
    let promis_array = []
    let req_history = {
      method: "history.get",
      args: {
        url: task.url,
        token: task.token,
        reqParam: {}
      }
    }

    for (let [key, value] of task.items_array.entries()) {
      if (value.length > 0) {
        req_history.args.reqParam = {
          itemids: value,
          time_from: task.lastTime || Date.now() / 1000 | 0,
          history: key
        }
        promis_array.push(await this.service.zabbixAPI.find(req_history))
      }
    }
    return Promise.all(promis_array)
  }

  enrichment(items, history) {
    let enrichment_items = []

    _.forEach(items, item => {
      let item_history = _.filter(history, {
        itemid: item.itemid
      })

      if (item_history.length) {
        item.history = item_history
        return enrichment_items.push(item)
      }
    })
    return enrichment_items
  }

  async handler(task) {
    let let_task = task
    if (let_task.enrichment_items.length) {
      return await this.service.check.find({
        zabbixCli_ID: let_task.zabbixCli_ID,
        enrichment_items: let_task.enrichment_items
      })

    } else {
      return "enrichment_items is enpty"
    }
  }

}
