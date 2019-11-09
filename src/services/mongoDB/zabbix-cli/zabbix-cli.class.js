const {Service} = require('feathers-mongoose')

exports.ZabbixCli = class ZabbixCli extends Service {

  constructor(args) {
    super(args)
    this.populate = {
      query: {
        $populate: {
          path: 'items',
          populate: {
            path: 'triggers',
            model: 'Triggers'
          }
        }
      }
    }
  }

  find(args) {
    try {
      return super.find(this.populate)
    } catch (e) {
      throw new Error(e)
    }
  }

  get(id) {
    try {
      return super.get(id, this.populate)
    } catch (e) {
      throw new Error(e)
    }
  }
}
