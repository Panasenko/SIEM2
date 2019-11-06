const mongoose = require('mongoose')
const Items = mongoose.model('Items')

class ItemsControll {

    static async create(data) {
        try {
            return await Items.create(data)
        } catch (e) {
            throw new Error(e)
        }
    }

    static async findById(id) {
        try {
            return await Items.findById(id)
        } catch (e) {
            throw new Error(e)
        }
    }

    static async findByIdAndRemove(id) {
        try {
            return await Items.findByIdAndRemove(id)
        } catch (e) {
            throw new Error(e)
        }
    }

    static async deleteMany(args) {
        try {
            return await Items.deleteMany(args)
        } catch (e) {
            throw new Error(e)
        }
    }

}

module.exports = ItemsControll