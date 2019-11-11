const mongoose = require('mongoose')
const logger = require('./../logger')

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
    },
    "items": [{ //TODO: Удалить и переделать логику
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items'
    }]
  }, {
    timestamps: true
  })


  try {
    return mongooseClient.model('zabbixCli', ZabbixCliSchema, 'zabbixCli');
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}
