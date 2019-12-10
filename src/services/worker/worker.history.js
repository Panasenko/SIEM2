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
        task.history = _.flatten(await this.iterator(task))
        task.lastTime = Date.now() / 1000 | 0
        return task
      })

      .then(task => {
        task.enrichment_items = this.enrichment(task)
        return task
      })

      .then(async task => {
        task.save_status = await this.save_db(task)
        return task
      })
      .then(async task => {
        task.validate = await this.validate(task)
        return task
      })

      .then(async task => {
        let {zabbixCli_ID, url, token, lastTime, items_array} = task
        task.redis = await this.redis_set(this.generete_rid(task), {zabbixCli_ID, url, token, lastTime, items_array})
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

  enrichment(task) {
    return _.forEach(task.history, item => Object.assign(item, _.find(task.items, {itemid: item.itemid})))
  }

  async save_db(task) {

    if (task.enrichment_items.length) {
      let res_create = _.map(task.enrichment_items, async item => {
        return await this.service.zabbix_tdb.create({
          id_item: String(item._id),
          itemid: item.itemid,
          clock: item.clock,
          value: item.value,
          ns: item.ns,
          units: item.units
        })
      })
      return Promise.all(res_create)
    } else {
      return []
    }
  }

  async validate(task) {
    if (task.enrichment_items.length) {
      return _.flatten(await Promise.all(_.map(task.enrichment_items, async item => await this.service.check.valid(item))))
    } else {
      return "enrichment_items is enpty"
    }
  }

  errorHandler(err) { //TODO: Добавить логирование
    console.log(err)
  }

}

