const _ = require('lodash')
const zabbixAPI = require('../../../modules/service.zabbix-api/zabbixAPI')

class HostsBQ {
    async applications(parent, args) {
        let Apps = await zabbixAPI.getApplications(args.url, args.token, parent)
        return _.filter(Apps, a => a.hostid === parent.hostid)
    }

    async graphics(parent, args) {
        let Apps = await zabbixAPI.getGraphics(args.url, args.token, parent)
        return _.filter(Apps, a => a.hosts[0].hostid === parent.hostid)
    }

    async items(parent, args) {
        let Apps = await zabbixAPI.getItems(args.url, args.token, parent)
        return _.filter(Apps, a => a.hostid === parent.hostid)
    }
}

module.exports = HostsBQ
