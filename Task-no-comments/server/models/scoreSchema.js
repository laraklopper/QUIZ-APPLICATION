const mongoose = require('mongoose');// Import the Mongoose library


//Define the score schema
const scoreSchema = new mongoose.Schema({
    // Field for username of the user who took the quiz
    username: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: true
    },
    // Field for the name of the quiz taken
    quizName: {
        type: mongoose.SchemaType.ObjectId,
        required: true,
        ref: 'quiz',
        set: (v) => v.toUpperCase(),
    },
    //Field for the score/result
    score: {
        type: Number,
        default: 0,
        required: true,
    },
    //Field for the number of attempts taken for the specific quiz
    attempts:{
        type: Number,
        default: 0,
        required: true,
    }, 
}, {timestamp: true})

// Export the score model based on the scoreSchema
module.exports = mongoose.model('scores', scoreSchema);