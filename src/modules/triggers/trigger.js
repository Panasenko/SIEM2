const _ = require('lodash')
const Event = require('./event')
const Instruction = require('./instruction')
const Methods = require('./methods')
const Time = require('./time')

class Trigger {
    constructor(args) {
        this._id = args._id
        this.name = args.name
        this.itemid = args.itemid
        this.closeTime = args.closeTime || 5

        this.eventIDSchema = args.eventIDSchema || null
        this.eventStatus = false
        this.eventTimeStart = null
        this.eventTimeNormalized = null

        this.disaster = Instruction.init(args.disaster)
        this.high = Instruction.init(args.high)
        this.average = Instruction.init(args.average)
        this.warning = Instruction.init(args.warning)
        this.information = Instruction.init(args.information)

        this.surchEvent(this.eventIDSchema)
    }

    async surchEvent(id){
        if(id){
            let event = await Event.findEvent(id)
            this.eventTimeStart = event.eventTimeStart
            this.eventTimeNormalized = event.eventTimeNormalized
            this.eventStatus = event.eventStatus
        }
    }

    paramEvent(data, level, status) {
        data.status = status
        data.level = level
        data.triggerID = this._id
        data.description = `Элемент данных ${this.itemid} в статусе ${this.status}, уровень ${this.level}`
        return data
    }


    workerAlerts(data) {
        if (!this.eventStatus) {

            this.eventStatus = true
            this.eventTimeStart = Time.unixTime()
            data.eventStatus = this.eventStatus = true
            data.itemid = this.itemid
            data.triggerID = this._id
            this.eventIDSchema = Event.addEvent(data)._id

        } else {
           if (!this.eventIDSchema) {
                return Event.updateEvent(this.eventIDSchema, data)
            }
            throw new Error("Event object not created")
        }
    }

    closeAlerts(data){

        if(!this.eventTimeNormalized && this.eventStatus){
            this.eventTimeNormalized = Time.unixTime()
        }

        switch (true) {
            case (this.eventStatus && this.eventTimeNormalized + (this.closeTime * 60) <= Time.unixTime()):
                this.eventStatus = false
                this.eventTimeStart = null
                this.eventTimeNormalized = null
                Event.closeEvent(this.eventIDSchema, this.paramEvent(data, "none","close"))
                this.eventIDSchema = null
                console.log("none close")
                break
            case (this.eventStatus):
                data.eventTimeNormalized = Time.nowTime()
                Event.updateEvent(this.eventIDSchema, this.paramEvent(data, "none","normalized"))
                console.log("none normalized")
                break
            default: console.log("none default")

        }
    }

    initParams() {
        let intervalTime = Methods.intervalTime
        let eventTimeStart = (_.isNull(this.eventTimeStart)) ? Time.unixTime() : this.eventTimeStart
        let nowTime = Time.unixTime()

        return [
            intervalTime,
            eventTimeStart,
            nowTime
        ]
    }


    check(data) {
        let params = this.initParams()

        switch (true) {
            case this.disaster(data, ...params):
                console.log("disaster")
                this.workerAlerts(this.paramEvent(data, "disaster", "active"))
                break
            case this.high(data, ...params):
                console.log("high")
                this.workerAlerts(this.paramEvent(data, "high", "active"))
                break
            case this.average(data, ...params):
                console.log("average")
                this.workerAlerts(this.paramEvent(data, "average", "active"))
                break
            case this.warning(data, ...params):
                console.log("warning")
                this.workerAlerts(this.paramEvent(data, "average", "active"))
                break
            case this.information(data, ...params):
                console.log("information")
                this.workerAlerts(this.paramEvent(data, "information", "active"))
                break
            default: this.closeAlerts(data)
        }
    }
}

module.exports = Trigger
