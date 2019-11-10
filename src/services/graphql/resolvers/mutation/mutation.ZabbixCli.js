const logger = require('./../../../../logger')

module.exports = function ZabbixCliMutation() {
  const app = this
  const ZabbixCliDB = app.service('zabbix-cli-DB')
  const itemsDB = app.service('itemsDB')
  const TriggersDB = app.service('itemsDB')


  return {
     createZabbixCli: async(parent, args) => {
       try {
        return  await ZabbixCliDB.create(args.input)
       }catch (e) {
         logger.log({
           level: 'error',
           label: 'mutation.ZabbixCli',
           message: ` createZabbixCli: async(parent, args) - ${e}`
         })
         throw new Error(e)
       }
     },
     updateZabbixCli: async(parent, args) => {
       try {
         return await ZabbixCliDB.patch(args._id, args.input)
       } catch (e) {
         logger.log({
           level: 'error',
           label: 'mutation.ZabbixCli',
           message: ` updateZabbixCli: async(parent, args) - ${e}`
         })
         throw new Error(e)
       }
     },

     deleteZabbixCli: async(parent, args) => { //TODO: завершить тестирование, исправить ошибки при удалении связанных элементов
       try {
         let elementDelete = await ZabbixCliDB.remove(args._id)

         console.log(elementDelete)
  /*       await itemsDB.remove(null, {zabbixCliIDSchema: args._id})
         await TriggersDB.remove(null,{zabbixCliIDSchema: args._id})*/
         return await elementDelete
       } catch (e) {
         logger.log({
           level: 'error',
           label: 'mutation.ZabbixCli',
           message: ` createZabbixCli: async(parent, args) - ${e}`
         })
        throw new Error(e)
       }

    }
  }

}
