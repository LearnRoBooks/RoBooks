const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    _id: String,
    holdata: [],
    settings: []
})


module.exports = mongoose.model('receipts', Schema)