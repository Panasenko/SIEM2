const _ = require('lodash')
const Trigger = require('./Trigger')

exports.Check = class Check {
  constructor(options) {
    this.driver = options
    this.tasker = {
      zabbixCli_ID: "5dd7d8face99982478e245f0",
      reqHistory: {
        method: 'history.get',
        args: {
          url: 'http://192.168.0.103/zabbix/api_jsonrpc.php',
          token: 'b1a13284396c5c2030dce37993375561',
          reqParam: [Object]
        }
      },
      items: [['23300', '28500', '23304'], [], [], ['23298'], []],
      resHistory: [
        {
          itemid: '23304',
          clock: '1574618364',
          value: '0.0000',
          ns: '351918717'
        },
        {
          itemid: '23300',
          clock: '1574618360',
          value: '0.0000',
          ns: '347908965'
        },
        {
          itemid: '28500',
          clock: '1574618340',
          value: '0.0000',
          ns: '331957940'
        },
        {
          itemid: '23298',
          clock: '1574618358',
          value: '357',
          ns: '344988195'
        }
      ]
    }

      // this.create(this.tasker)
  }

  create(task) {
    if (task.zabbixCli_ID && task.resHistory.length) {
      this.conveyor(task)
    }
  }

  conveyor(task) {
    new Promise(async (resolve, reject) => {
      task.triggers = await this.driver.triggersDB.find({query: {zabbixCli_ID: task.zabbixCli_ID}})
      if (task.triggers.length) {
        resolve(task)
      } else {
        reject(new Error("empty respons triggers"))
      }
    })

      .then(task => {
        task.triggers = this.initTriggers(task)
        return task
      })

      .catch(err => {
        console.log(err)
      })

      .then(task => {
        task.resHistory = this.validation(task)
        console.log(task)
        return task
      })
  }

  initTriggers(task) {
    return  _.reduce(task.triggers, function (accumulator, value) {
      accumulator.push(new Trigger(value, task.zabbixCli_ID))
      return accumulator
    }, [])
  }

  async validation(task) {
    return  _.forEach(task.resHistory, async value => {
        let arrTrig = _.filter(task.triggers, {itemid: value.itemid})
        if (arrTrig.length) {
          return await _.forEach(arrTrig, async trigger => {
            value.resTrigger = await trigger.check(value)
            return value
          })
        } else {
          value.resTrigger = "not trigger"
          return value
        }
      })
  }


}
