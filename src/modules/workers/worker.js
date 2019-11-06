class Worker {
    constructor(args) {
        this._id = args._id
        this._name = args.name
        this._description = args.description
        this._url = args.url
        this._token = args.token
        this._intervalTime = args.intervalTime || 10000
        this._inProgress = args.inProgress || false
        this._lastTime = args.lastTime || Date.now() / 1000 | 0
        this._isError = false
        this._timerID = null
        this._status = false
    }

    get name() {
        return this._name
    }

    set name(value) {
        this._name = value
    }

    get description() {
        return this._description
    }

    set description(value) {
        this._description = value
    }

    get url() {
        return this._url
    }

    set url(value) {
        this._url = value
    }

    get token() {
        return this._token
    }

    set token(value) {
        this._token = value
    }

    get inProgress() {
        return this._inProgress
    }

    set inProgress(value) {
        this._inProgress = value
    }

    get status() {
        return this._status
    }

    set status(value) {
        this._status = value
    }

    get timerID() {
        return this._timerID
    }

    set timerID(value) {
        this._timerID = value
    }

    get lastTime() {
        return this._lastTime
    }

    set lastTime(value) {
        this._lastTime = value
    }

    get intervalTime() {
        return this._intervalTime
    }

    set intervalTime(value) {
        this._intervalTime = value
    }

    get isError() {
        return this._isError
    }

    set isError(value) {
        this._isError = value
    }
}

module.exports = Worker
