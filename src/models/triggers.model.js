const mongoose = require('mongoose')
const logger = require('./../logger')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const triggers = new Schema({ //TODO: добавить важность триггера
    "name": {
      type: String,
      required: true
    },
    "description": {
      type: String
    },
    "itemid": {
      type: String,
      required: true
    },
    "closeTime": {
      type: Number,
      required: true
    },
    "disaster": {
      type: String,
      default: null
    },
    "high": {
      type: String,
      default: null
    },
    "average": {
      type: String,
      default: null
    },
    "warning": {
      type: String,
      default: null
    },
    "information": {
      type: String,
      default: null
    },
    "item_ID": {
      type: mongoose.Schema.Types.ObjectId
    },
    "zabbixCli_ID": {
      type: mongoose.Schema.Types.ObjectId
    },
  }, {
    timestamps: true
  });

  try {
    return mongooseClient.model('Triggers', triggers, 'triggers')
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
};
