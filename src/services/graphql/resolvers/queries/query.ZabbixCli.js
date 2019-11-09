const _ = require('lodash')
//const ZabbixCliDB = require('../../../database/controllers/controll.ZabbixCli')

class ZabbixCliQuery {
    async zabbixCliFindById(parent, args) {
        return //await ZabbixCliDB.findById(args._id)
    }

    async zabbixCliFind(parent, args) {
        return //await ZabbixCliDB.find({})
    }
}

module.exports = ZabbixCliQuery
