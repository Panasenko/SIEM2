class Methods {
   static intervalTime(clock, from, before) {
        let getHours = new Date(clock * 1000).getHours()
        return from <= getHours && getHours <= before
    }
}

module.exports = Methods