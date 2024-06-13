// Import the Mongoose library for MongoDB interactions
const mongoose = require('mongoose');

// Define the Quiz schema using Mongoose's Schema method
const QuizSchema = mongoose.Schema({
    // Define the 'quizName' field which is a required string
    quizName: {
        type: String,         // The type of this field is String
        required: true,       // This field is required
    },
    // Define the 'username' field which is a required string
    username: {
        type: String,         // The type of this field is String
        required: true,       // This field is required
    },
    // Define the 'questions' field as an array of objects
    questions: {
        type: [{
            questionText: String,    // The text of the question
            correctAnswer: String,   // The correct answer to the question
            options: [String]        // An array of possible answer options
        }],
        default: [],            // Default value is an empty array if no questions are provided
        required: true,         // This field is required
    }
},
    {
        // Enable timestamps to automatically add 'createdAt' and 'updatedAt' fields
        timestamps: true
    });

// Export the Quiz model based on the QuizSchema
module.exports = mongoose.model('Quiz', QuizSchema);
