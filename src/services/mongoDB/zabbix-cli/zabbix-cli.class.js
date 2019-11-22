const {Service} = require('feathers-mongoose')

exports.ZabbixCliDB = class ZabbixCliDB extends Service {
  constructor(options, app) {
    super(options)
    this.itemsDB = app.service('itemsDB')
    this.triggersDB = app.service('triggersDB')
  }

  remove(id, params) {
    return new Promise((resolve) => {
      resolve(super.remove(id))
    })
      .then(delzabbixCli_ID => {
          this.itemsDB.remove(null, {query: {zabbixCli_ID: delzabbixCli_ID._id}})
          return delzabbixCli_ID
        }
      )
      .then(delzabbixCli_ID => {
          this.triggersDB.remove(null, {query: {zabbixCli_ID: delzabbixCli_ID._id}})
          return delzabbixCli_ID
        },
        err => console.log(err))
      .catch(err => console.log(err))
  }

}
