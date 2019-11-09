const _ = require('lodash')
const zabbixAPI = require('../../../services/zabbix-api/service.zabbix-api/service.zabbix-api.zabbixAPI')

class ZabbixAPIQuery {
    async token(parent, args) {
        let token = await zabbixAPI.login(args.url, args.input)
        return {
            token: token
        }
    }

    async version(parent, args) {
        let vers = await zabbixAPI.getVersion(args.url, null, {})
        return {version: vers}
    }

    async hostgroup(parent, args) {
        return await zabbixAPI.getHostGroup(args.url, args.token, args.reqParam)
    }

    async hosts(parent, args) {
        return await zabbixAPI.getHosts(args.url, args.token, args.reqParam)
    }

    async applications(parent, args) {
        return await zabbixAPI.getApplications(args.url, args.token, args.reqParam)
    }

    async graphics(parent, args) {
        return await zabbixAPI.getGraphics(args.url, args.token, args.reqParam)
    }

    async items(parent, args) {
        return await zabbixAPI.getItems(args.url, args.token, args.reqParam)
    }
}

module.exports = ZabbixAPIQuery
