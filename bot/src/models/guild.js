const { Schema, model } = require('mongoose')
const cfg = require('../../../config')
let schema = Schema({
    guildID: {
        type: String,
        required: true,
        unique: true,
    },
    prefix: {
        type: String,
        default: cfg.prefix
    }
})

module.exports = model('Guilds', schema)
