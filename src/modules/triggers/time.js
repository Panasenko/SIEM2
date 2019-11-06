const moment = require('moment')

class Time {
    static nowTime(){
        return moment().format('DD.MM.YYYY-HH:mm:ss')
    }

    static unixTime(time){
        return moment().unix(time)
    }
}

module.exports = Time