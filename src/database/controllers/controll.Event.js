const mongoose = require('mongoose')
const EventsAlert = mongoose.model('EventsAlert')

class EventControll {
    static async find(args) {
        try {
            return await EventsAlert.find(args)
        } catch (e) {
            throw new Error(e)
        }
    }


    static async findById(args) {
        try {
            return await EventsAlert.findById(args)
        } catch (e) {
            throw new Error(e)
        }
    }

    static async create(args) {
        try {
            return await EventsAlert.create(args)
        } catch (e) {
            throw new Error(e)
        }
    }

    static async findByIdAndUpdate(id, data) {
        try {
            return await EventsAlert.findByIdAndUpdate(id, data, {new: true})
        } catch (e) {
            throw new Error(e)
        }
    }

    static async findByIdAndRemove(id) {
        try {
            return await EventsAlert.findByIdAndRemove(id)
        } catch (e) {
            throw new Error(e)
        }

    }
}

module.exports = EventControll