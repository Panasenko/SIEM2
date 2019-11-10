const ZabbixAPIQuery = require('./queries/query.ZabbixAPI')
const ZabbixCliQuery = require('./queries/query.ZabbixCli')
const HostsBQ = require('../../resolvers/build/build.query.HostsBQ')
const ZabbixCliMutation = require('./mutations/mutation.ZabbixCli')
const ItemsMutation = require('./mutations/mutation.Items')
const TriggersMutation = require('./mutations/mutation.Triggers')


 class Resolvers{

    constructor(){
        this.ZabbixAPIQuery = new ZabbixAPIQuery()
        this.ZabbixCliQuery = new ZabbixCliQuery()

        this.HostsBQ = new HostsBQ()

        this.ZabbixCliMutation = new ZabbixCliMutation()
        this.ItemsMutation = new ItemsMutation()
        this.TriggersMutation = new TriggersMutation()

        return {
            Query: this.query(),
            Mutation: this.mutation(),
            Hosts: this.buildQuery()
        }
    }

    query(){
        return { //TODO: попробовать объеденять обекты созданные в конструкторах методом Object.assign
            zabbixCliFindById: this.ZabbixCliQuery.zabbixCliFindById,
            zabbixCliFind: this.ZabbixCliQuery.zabbixCliFind,

            token: this.ZabbixAPIQuery.token,
            version: this.ZabbixAPIQuery.version,
            hostgroup: this.ZabbixAPIQuery.hostgroup,
            hosts: this.ZabbixAPIQuery.hosts,
            applications: this.ZabbixAPIQuery.applications,
            graphics: this.ZabbixAPIQuery.graphics,
            items: this.ZabbixAPIQuery.items
        }
    }

    buildQuery(){
        return {
            applications: this.HostsBQ.applications,
            graphics: this.HostsBQ.graphics,
            items: this.HostsBQ.items
        }
    }

    mutation(){
        return {
            createZabbixCli: this.ZabbixCliMutation.createZabbixCli,
            updateZabbixCli: this.ZabbixCliMutation.updateZabbixCli,
            deleteZabbixCli: this.ZabbixCliMutation.deleteZabbixCli,

            createItemsToZabbixCli: this.ItemsMutation.createItemsToZabbixCli,
            deleteItemsToZabbixCli: this.ItemsMutation.deleteItemsToZabbixCli,

            createTriggersToItems: this.TriggersMutation.createTriggersToItems,
            deleteTriggersToItems: this.TriggersMutation.deleteTriggersToItems
        }
    }

}

module.exports = new Resolvers()
