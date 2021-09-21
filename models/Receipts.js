const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    _id: String,
    holdata: []
})


module.exports = mongoose.model('receipts', Schema)