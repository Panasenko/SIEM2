const mongoose = require('mongoose')

const ItemsSchema = new mongoose.Schema({
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
        unique: true,
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

})

mongoose.model('Items', ItemsSchema, 'items')
