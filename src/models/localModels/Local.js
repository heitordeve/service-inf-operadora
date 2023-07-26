const mongoose = require('mongoose')

const Local = mongoose.model('Local', {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },   
    infos: {
        type: Object,
    },
    user: {
        type: Object,
    },
    cityId: {
        type: Object,
    },
    createAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = Local;