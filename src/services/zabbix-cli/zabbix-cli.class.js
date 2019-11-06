const { Service } = require('feathers-mongoose')

exports.ZabbixCli = class ZabbixCli extends Service {
  static async find(args) {
    try {
      return await ZabbixCli.find(args).populate({
        path: 'items',
        model: 'Items',
        populate: {
          path: 'triggers',
          model: 'Triggers'
        }
      })
    } catch (e) {
      throw new Error(e)
    }
  }


  static async findById(args){
    try{
      return await ZabbixCli.findById(args).populate({
        path: 'items',
        model: 'Items',
        populate: {
          path: 'triggers',
          model: 'Triggers'
        }
      })
    }catch (e) {
      throw new Error(e)
    }
  }

  static async create(args){
    try{
      return await ZabbixCli.create(args)
    }catch (e) {
      throw new Error(e)
    }
  }

  static async findByIdAndUpdate(id, data){
    try{
      return await ZabbixCli.findByIdAndUpdate(id, data, {new: true})
    }catch (e) {
      throw new Error(e)
    }
  }

  static async findByIdAndRemove(id){
    try{
      return await ZabbixCli.findByIdAndRemove(id)
    }catch (e) {
      throw new Error(e)
    }
  }
}
