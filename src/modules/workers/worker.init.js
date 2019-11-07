const _ = require('lodash')
const HistoryWorker = require('./worker.history')
const ZabbixCliDB = require('../../database/controllers/controll.ZabbixCli')

let instance = null

class Initializer {
    constructor() {
        if (instance) {
            instance = this
        }
        this._observers = []
       // this.startWorkerHistory()  //.then(err => console.log(err))
        return instance
    }

     startWorkerHistory() {
        let data = ZabbixCliDB.find({})
        _.forEach(data, async (item) => {
          console.log(item)
            return this.createWorkers(new HistoryWorker(item))
        })
    }

    createWorkers(obj) {
        this._observers.push(obj)
    }

    deleteWorkers(id) {
        this._observers = _.filter(this._observers, subscriber => String(subscriber._id) !== id)
    }

    updateWorkers(id) {
        _.forEach(this._observers, (subscriber) => {
            if (String(subscriber._id) === id) {
                subscriber.updateProperties().then(r => console.error(r))
            }
        })

    }

}

module.exports = new Initializer()
