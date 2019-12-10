const mongoose = require('mongoose')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const items = new Schema({
    "zabbixCli_ID": {
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
    }

  }, {
    timestamps: true
  });

  try {
    return mongooseClient.model('Items', items, 'items')
  } catch (e) {
    app.get('logger').log({
      level: 'error',
      label: 'items model',
      message: e
    })
    throw new Error(e)
  }
};
