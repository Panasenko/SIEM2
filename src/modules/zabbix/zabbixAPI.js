const Errors = require("./Errors")
const CallAPI = require("./CallAPI")

class ZabbixAPI { //TODO: реализовать методы получения событий и проблем
    static async callAPI(url, token, method, params) {
        let new_Obj = new CallAPI(url)
        let result = await new_Obj.call(method, token, params)
        return await result.data.result
    }

    static async login(url, reqParam) {
        Errors.valid(reqParam, this.constructor.name, "login")
        return await this.callAPI(url, null, "user.login", reqParam)
    }

    static async getVersion(url) {
        return await this.callAPI(url, null, "apiinfo.version", {})
    }

    static async getHosts(url, token, reqParam) {
        let params = {
            output: "extend",
            selectInterfaces: ["interfaceid", "ip"]
        }
        Errors.valid(params, this.constructor.name, "getHosts")
        return await this.callAPI(url, token, "host.get", params)
    }

    static async getHostGroup(url, token, reqParam) {
        let params = {
            "output": "extend",
            "real_hosts": true,
            "selectHosts": ["hostid", "host", "name", "description", "status"]
        }
        Errors.valid(params, this.constructor.name, "getHostGroup")
        return await this.callAPI(url, token, "hostgroup.get", params)
    }

    static async getItems(url, token, reqParam) {
        let params = {
            output: "extend",
            hostids: reqParam.hostid,
            sortfield: "name",
            selectGraphs: "extend",
            selectApplications: "extend"
        }
        Errors.valid(params, this.constructor.name, "getItems")
        return await this.callAPI(url, token, "item.get", params)
    }

    static async getHistory(url, token, reqParam) {
        let params = {
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


        Errors.valid(params, this.constructor.name, "getHistory")
        return await this.callAPI(url, token, "history.get", params)
    }

    static async getGraphics(url, token, reqParam) {
        let params = {
            "output": "extend",
            "hostids": reqParam.hostid,
            "sortfield": "name",
            "selectItems": "extend",
            "selectHosts": "hostid"
        }

        Errors.valid(params, this.constructor.name, "getGraphics")
        return await this.callAPI(url, token, "graph.get", params)
    }

    static async getGraphItems(url, token, reqParam) {
        let params = {
            output: "extend",
            expandData: 1,
            graphids: reqParam.graphids
        }
        Errors.valid(params, this.constructor.name, "getGraphItems")
        return await this.callAPI(url, token, "graphitem.get", params)
    }

    static async getApplications(url, token, reqParam) {
        let params = {
            output: "extend",
            hostids: reqParam.hostid,
            selectItems: "extend"
        }
        Errors.valid(params, this.constructor.name, "getApplications")
        return await this.callAPI(url, token, "application.get", params)
    }
}

module.exports = ZabbixAPI
