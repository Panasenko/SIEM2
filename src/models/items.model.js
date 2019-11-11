const mongoose = require('mongoose')
const logger = require('./../logger')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const items = new Schema({
    "zabbixCliIDSchema": {
      type: mongoose.Schema.Types.ObjectId
    },
    "name": {
      type: String,
      required: true
    },
    "hostid": {
      type: String,
      required: true
    },
    "itemid": {
      type: String,
      required: true
    },
    "description": {
      type: String
    },
    "value_type": {
      type: String
    },
    "units": {
      type: String
    },
    "triggers": [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Triggers'
    }]

  }, {
    timestamps: true
  });

  try {
    return mongooseClient.model('Items', items, 'items')
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
};
