const mongoose = require('mongoose');

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
        required,
    },
    attempts:{
        type: Number,
        default: 0,
        required: true,
    }, 
}, {timestamp: true})

module.exports = mongoose.model('scores', scoreSchema);
