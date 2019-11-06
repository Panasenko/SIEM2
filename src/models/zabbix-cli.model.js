// zabbixCli-model.js - A mongoose model
const mongoose = require('mongoose')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const zabbixCli = new Schema({
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
    "items": [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items'
    }]
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model('zabbixCli');
  } catch (e) {
    return mongooseClient.model('zabbixCli', zabbixCli);
  }
};
