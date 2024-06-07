// Import the Mongoose library
const mongoose = require('mongoose');

// Define the Quiz schema
const QuizSchema = mongoose.Schema({
    // Field for the quiz name, which is a required string
    quizName: {
        type: String,
        required: true,
    },
    // Field for the username of the person who created the quiz, which is a required string
    username: {
        type: String,
        required: true,
    },
    // Field for the questions, which is a required array of strings. Default is an empty array.
    questions: { 
        type: [String],  // Specifies that the field should be an array of strings
        default: [],     // Sets the default value to an empty array if none is provided
        required: true,  // Marks the field as required, meaning it must be provided
    },
    // Field for the options, which is a required array of arrays of strings. Default is an empty array.
    options: { 
        type: [[String]],  // Specifies that the field should be an array of arrays of strings
        default: [],       // Sets the default value to an empty array if none is provided
        required: true     // Marks the field as required, meaning it must be provided
    },
    // Field for the answers, which is a required array of strings. Default is an empty array.
    answers: {
        type: [String],  // Specifies that the field should be an array of strings
        default: [],     // Sets the default value to an empty array if none is provided
        required: true,  // Marks the field as required, meaning it must be provided
    }
}, 
// Enable timestamps to automatically add createdAt and updatedAt fields
{ timestamps: true });

// Export the Quiz model based on the QuizSchema
module.exports = mongoose.model('quiz', QuizSchema);
