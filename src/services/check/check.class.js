const _ = require('lodash')
const Trigger = require('./Trigger')

exports.Check = class Check {
  constructor(service) {
    this.service = service
    this.trigger = []
    this.init()
  }

  init() {
    new Promise(async (resolve, reject) => {
      const trigger = await this.service.triggersDB.find()
      if (trigger.length) {
        resolve(trigger)
      }
      reject(new Error("trigger is empty"))
    })
      .then(
        triggers => {
          let service = this.service
          _.forEach(triggers, async value => this.trigger.push(new Trigger(value, service)))
        }
      )
      .catch(err => {
        console.log(err)
      })
  }

  create(data) {
    if (!_.find(this.trigger, item => item.trigger._id === data._id)) {
      return this.trigger.push(new Trigger(data, service))
    }
    throw new Error("Trigger exists")
  }

  get(id) {
    return _.filter(this.trigger, items => items.trigger._id === id)
  }

  async find() {
    return this.trigger
  }

  update(id, data) {
    _.forEach(this.trigger, item => {
      if (String(item.trigger._id) === id) {
        //TODO: добавдить реализацию обновления

        console.log(item)
      }
    })
  }

  remove(id) {
      this.trigger = _.filter(this.trigger, items => String(items._id) !== id)
      return true
  }

  async valid(task) {
    return Promise.all(_.map(_.filter(this.trigger, {itemid: task.itemid}), async trigger => {
      return await trigger.check(task)
    }))
  }
}
