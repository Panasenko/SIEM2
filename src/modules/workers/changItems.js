const _ = require('lodash')

class ChangItems {

    static parsItems(items) {
        if (_.every(items, value => _.isObject(value))) {
            return _.reduce(items, function (accumulator, value) {
                accumulator[+value.value_type].push(value.itemid)
                return accumulator
            }, [[],[],[],[],[]])
        } else if (_.every(items, value => _.isString(value))) {
            return items
        } else {
            throw new Error('function parsItems - incorrect params')
        }
    }

    static createItems(itemsArr, items) {

        if(_.isArray(itemsArr) && _.isObject(items)) {
            if (!_.some(itemsArr, items)){
                return itemsArr.push(items)
            }
        } else {
            throw new Error("Method createItems - Invalid parameters passed")
        }
    }

    static deleteItems(itemsArr, items) {

        if(_.isArray(itemsArr) && _.isObject(items)) {
            return _.reject(itemsArr, items)
        } else {
            throw new Error("Method deleteItems - Invalid parameters passed")
        }
    }
}

module.exports = ChangItems

