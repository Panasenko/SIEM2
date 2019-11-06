const axios = require('axios')
const RB = require('./RequestBuilder')
const Errors = require("./Errors")

class CallAPI extends Errors {
    constructor(url) {
        super()
        this._url = url
    }

    get url() {
        Errors.valid(this._url, this.constructor.name, "get url")
        return this._url
    }

    async call(method, token, params) {

        try {
            return await axios({
                baseURL: this.url,
                method: 'post',
                headers: {
                    Accept: 'application/json',
                },
                data: RB.build(method, token, params),
                timeout: 40000,
                retries: 0
            })
        } catch (error) {
            throw new Error(`Class ${this.constructor.name}, method \"call\" - ${error}`)
        }
    }
}

module.exports = CallAPI