const mongoose = require('mongoose');// Import the Mongoose library

const scoreSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    quizName: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: 0,
        required: true,
    },
    attempts:{
        type: Number,
        default: 0,
        required: true,
    }, 

}, {timestamp: true})

module.exports = mongoose.model('scores', scoreSchema);