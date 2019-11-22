const logger = require('./../../logger')
const CallAPI = require("./service.zabbix-api/service.zabbix-api.callAPI")

 class ZabbixApi {

  async find({method, args}) {
    let {url, token, reqParam} = args
    let params = {}

    switch (method) {
      case "apiinfo.version":
        params = {}
        break
      case "user.login":
        params = reqParam
        break
      case "host.get":
        params = {
          output: "extend",
          selectInterfaces: ["interfaceid", "ip"]
        }
        break
      case "hostgroup.get":
        params = {
          "output": "extend",
          "real_hosts": true,
          "selectHosts": ["hostid", "host", "name", "description", "status"]
        }
        break
      case "item.get":
        params = {
          output: "extend",
          hostids: reqParam.hostid,
          sortfield: "name",
          selectGraphs: "extend",
          selectApplications: "extend"
        }
        break
      case "history.get":
        params = {
          output: "extend",
          itemids: reqParam.itemids,
          history: reqParam.history || 0,
          sortfield: "clock",
          sortorder: "DESC"
        }

        if(reqParam.time_from){
          params.time_from = reqParam.time_from
        }

        if(reqParam.time_till){
          params.time_till = reqParam.time_till
        }
        break
      case "graph.get":
        params = {
          "output": "extend",
          "hostids": reqParam.hostid,
          "sortfield": "name",
          "selectItems": "extend",
          "selectHosts": "hostid"
        }
        break
      case "graphitem.get":
        params = {
          output: "extend",
          expandData: 1,
          graphids: reqParam.graphids
        }
        break
      case "application.get":
        params = {
          output: "extend",
          hostids: reqParam.hostid,
          selectItems: "extend"
        }
        break
      default:
        logger.log({
          level: 'error',
          label: 'zabbix-api.class',
          message: `method not found`
        })
        throw new Error({
          level: 'info',
          label: 'zabbix-api.class',
          message: `method not found`
        })
    }
    return await this.callAPI(url, token, method, params)

  }

  async callAPI(url, token, method, reqParams) { //TODO: переделать метод, упростить и сделать обработку ошибок возвращаемых ошибок в ответе
    try {
      let new_Obj = new CallAPI(url)
      let result = await new_Obj.call(method, token, reqParams)
      return await result.data.result
    } catch (e) {
      logger.log({
        level: 'error',
        label: 'zabbix-api.class',
        message: e
      })
      throw new Error({
        level: "error",
        label: "zabbix-api.class",
        message: e
      })
    }
  }
}

module.exports = ZabbixApi
