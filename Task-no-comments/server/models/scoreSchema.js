// Import necessary modules and packages
// Import the Mongoose library
const mongoose = require('mongoose');
// Import the autopopulate plugin for Mongoose
const autopopulate = require('mongoose-autopopulate');

//Define the score schema
const scoreSchema = new mongoose.Schema({
    /* Field for username of the user who
    took the quiz*/
    userId: {
        type: mongoose.Schema.Types.ObjectId,// Define the type as ObjectId
        ref: 'User',// Reference the User collection
        autopopulate: true,// Automatically populate the quiz field
        required: true,//Indicate that the username is required
        /*Validate to ensure the quiz is a valid objectId*/
        validate: {
            validator: mongoose.Types.ObjectId.isValid,// Validate the ObjectId format
            message: 'Invalid user Id',//Custom error message if validation fails
        },
    },
    // Field for the name of the quiz taken
    quizId: {
        type: mongoose.Schema.Types.ObjectId,// Define the type as ObjectId
        ref: 'Quiz',// Reference the Quiz collection
        autopopulate: true,// Automatically populate the quiz field
        required: [true, 'Quiz name is required'],//Indicate that the quizName is required
        /*Validate to ensure the username is a valid objectId*/
        validate:{
            validator: mongoose.Types.ObjectId.isValid,// Validate the ObjectId format
            message: 'Invalid quiz Id',//Custom error message if validation fails
        },
    },
    score: {
        type: Number,  // Define the type as Number
        default: 0,// Default score value
        required: true, //Indicate that the score is required
        set: (v) => Math.floor(v),//Ensure the score is an integer
        /*Validate to ensure the score is a valid integer*/
        validate: {
            validator: Number.isInteger, // Validate that score is an integer
            message: 'Score must be an integer',//Custom error message if validation fails
        },
    },
    //Field for the number of times the user has attempted the quiz
    attempts: {
        type: Number,  // Define the type as Number
        default: 0,//Default value for attempts
        // required: true,   //State that the number of attempts is required
        set: (v) => Math.floor(v), // Ensure attempts is an integer
    }, 
}, {timestamps: true})
// Automatically adds createdAt and updatedAt fields

// Apply autopopulate plugin to the schema
scoreSchema.plugin(autopopulate);

// Create indexes on userId and quizId for faster lookups
scoreSchema.index({ userId: 1 }); // Create an index on userId
scoreSchema.index({ quizId: 1 }); // Create an index on quizId

// Export the score model based on the scoreSchema
module.exports = mongoose.model('Score', scoreSchema);