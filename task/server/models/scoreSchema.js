// Import necessary modules and packages
const mongoose = require('mongoose');// Import the Mongoose library
// const autopopulate = require('mongoose-autopopulate');// Import the autopopulate plugin for Mongoose

//Define the score schema
const scoreSchema = new mongoose.Schema({
    /* Field for username of the user who
    took the quiz*/
     username: {
        type: String,
        required: [true, 'username is required'],
    },
    /* userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',// Reference the User collection
        autopopulate: true,// Automatically populate the quiz field
        required: true,
        //Validate to ensure the username is a valid objectId
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid user Id',//Custom error message if validation fails
        },
    }, */
    // Field for the name of the quiz taken
     name: {
        type: String,
        required:[true, 'Quiz name is required'],   
    },
    /* quizId: {
        type: mongoose.Schema.Types.ObjectId,
        // Reference the Quiz collection
        ref: 'Quiz',
        autopopulate: true,// Automatically populate the quiz field
        required: [true, 'Quiz name is required'],
        // Validate to ensure the username is a valid objectId
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid quiz Id',//Custom error message if validation fails
        },
    },*/
    //Field for the score
    score: {
        type: Number,// Define the type as Number
        default: 0,
        required: true,
        //Ensure the score is an integer
        set: (v) => Math.floor(v),
        /*Validate to ensure the score is a valid integer*/
        validate: {
            validator: Number.isInteger,
            message: 'Score must be an integer',//Custom error message if validation fails
        },
    },
    //Field for the number of times the user has attempted the quiz
    attempts: {
        type: Number,  
        default: 1,
        set: (v) => Math.floor(v),
    },
    //Field for the date of the current attempt
    date: {
        type: Date,//Define the dataType as a date
        default: Date.now,
        required: true,
    },
},{timestamps: true});

// Apply autopopulate plugin to the schema
// scoreSchema.plugin(autopopulate);

scoreSchema.index({ username: 1, name: 1 }, { unique: true });

// Export the score model based on the scoreSchema
module.exports = mongoose.model('Score', scoreSchema);
