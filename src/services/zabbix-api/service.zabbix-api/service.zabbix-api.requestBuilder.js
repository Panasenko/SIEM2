const Errors = require("./service.zabbix-api.valid-errors")

class ServiceZabbixApiRequestBuilder extends Errors {

    static build(method, token, params) {
        Errors.valid(method, this.constructor.name, "build")

        if (method !== "apiinfo.version" && method !== "user.login") {
            Errors.valid(token, this.constructor.name, "build")
        }

        if (method !== "apiinfo.version") {
            Errors.valid(params, this.constructor.name, "build")
        }

        return {
            method: method,
            auth: token,
            params: params,
            jsonrpc: 2.0,
            id: this.generationId()
        }
    }

    static generationId() {
        return Math.floor(Math.random() * (10000 - 1))
    }

}

module.exports = ServiceZabbixApiRequestBuilder
