// Import necessary modules and packages
const mongoose = require('mongoose');// Import the Mongoose library
const autopopulate = require('mongoose-autopopulate');// Import the autopopulate plugin for Mongoose

//Define the score schema
const scoreSchema = new mongoose.Schema({
    /* Field for username of the user who
    took the quiz*/
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',      
        autopopulate: true,// Automatically populate the username field
        required: true,
        /*Validate to ensure that the 'username' is a 
        valid ObjectId*/
        validate: {
            validator: mongoose.Types.ObjectId.isValid,            
            message: 'Invalid user Id',// Custom error message if validation fails
        },
    },
    // Field for the name of the quiz taken
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Quiz',
        autopopulate: true,// Automatically populate the quiz field
        required: true,
        set: (v) => v.toUpperCase(), // Transform the value to uppercase before saving
        /*Validate to ensure that the 'username' is a
       valid ObjectId*/
        validate:{
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid quiz Id',// Custom error message if validation fails
        },
    },
    score: {
        type: Number, 
        default: 0,
        required: true, 
        set: (v) => Math.floor(v), 
    },
    //Field for the number of times the user has attempted the quiz
    attempts: {
        type: Number, 
        default: 0,//Default value for attempts
        required: true,   
        /*Ensure the number of attempts is saved as an integer by 
        rounding down any decimal values*/
        set: (v) => Math.floor(v),
    }, 
}, {timestamps: true})
// Automatically adds createdAt and updatedAt fields

// Apply autopopulate plugin to the schema
scoreSchema.plugin(autopopulate);

// Export the score model based on the scoreSchema
module.exports = mongoose.model('Score', scoreSchema);
