const mongoose = require('mongoose')

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const events = new Schema({
    "triggers_ID": {
      type: mongoose.Schema.Types.ObjectId
    },
    "description": {
      type: String
    },
    "itemid": {
      type: String,
      required: true
    },
    "status": {
      type: String,
      required: true
    },
    "eventStatus": {
      type: Boolean,
      required: true
    },
    "level": {
      type: String,
      required: true
    },
    "eventTimeStart": {
      type: String
    },
    "eventTimeUpdate": {
      type: String
    },
    "eventTimeNormalized": {
      type: String
    },
    "eventTimeClose": {
      type: String
    },
    "lastClock": {
      type: Number
    },
    "lastValue": {
      type: Number
    },
    "historyChange": [{
      type: String
    }]
  }, {
    timestamps: true
  });

  try {
    return mongooseClient.model('EventsAlert', events, 'events')
  } catch (e) {
    app.get('logger').log({
      level: 'error',
      label: 'events model',
      message: e
    })
    throw new Error(e)
  }
};
