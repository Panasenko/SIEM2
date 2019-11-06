const Time = require('./time')
const TriggersDB = require('../../database/controllers/controll.Triggers')
const EventDB = require('../../database/controllers/controll.Event')

class Event {
    static async findEvent(id) {
        try {
            return await EventDB.findById(id)
        } catch (e) {
            throw new Error(e)
        }

    }

    static async addEvent(args) {

        console.log(args)

    //    args.eventTimeStart = Time.nowTime()
       /* args.historyChange = []
        args.historyChange.push(args)*/

        try {
            let newEvent = await EventDB.create(args)
            await TriggersDB.findByIdAndUpdate(newEvent.TriggersIDSchema, {eventIDSchema: newEvent._id})
            return newEvent
        } catch (e) {
            throw new Error(e)
        }

    }

    static async updateEvent(id, args) {
        args.eventTimeUpdate = Time.nowTime()
        try {
            return await EventDB.findByIdAndUpdate(id, args)
        } catch (e) {
            throw new Error(e)
        }
    }

    static async closeEvent(id, args) {
        args.eventTimeClose = Time.nowTime()
        try {
            let closeEvent = await EventDB.findByIdAndUpdate(id, data)
            await TriggersDB.findByIdAndUpdate(closeEvent.TriggersIDSchema, {eventIDSchema: null})
            return closeEvent
        } catch (e) {
            throw new Error(e)
        }
    }

}

module.exports = Event