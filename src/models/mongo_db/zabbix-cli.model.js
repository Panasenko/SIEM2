const mongoose = require('mongoose')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const {Schema} = mongooseClient
  const ZabbixCliSchema = new Schema({
    "name": {
      type: String,
      required: true
    },
    "description": {
      type: String
    },
    "url": {
      type: String,
      unique: true,
      required: true
    },
    "token": {
      type: String,
      required: true
    },
    "inProgress": {
      type: Boolean,
      default: false
    },
    "lastTime": {
      type: Number
    },
    "intervalTime": {
      type: Number
    }
  }, {
    timestamps: true
  })


  try {
    return mongooseClient.model('zabbixCli', ZabbixCliSchema, 'zabbixCli');
  } catch (e) {
    app.get('logger').log({
      level: 'error',
      label: 'zabbixcli model',
      message: e
    })
    throw new Error(e)
  }
}
