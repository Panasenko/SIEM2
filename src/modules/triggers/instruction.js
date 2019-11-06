class Instruction {
    static init(instruction) {
        if(this.validateInstruction(instruction)){
            let args = `{clock, value}, intervalTime, eventTimeStart, nowTime`
            let bodyFunc = `return ${instruction}`

            return new Function(args, bodyFunc)
        }
        throw new Error("bad instruction")

    }

    static validateInstruction(instruction) {
        let regExp = /((\w|\s)=(\w|\s)|(return|function|throw)|(["'`{}])|(=[>]))/gi
        return !regExp.test(instruction)
    }
}

module.exports = Instruction