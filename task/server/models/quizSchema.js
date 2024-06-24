const mongoose = require('mongoose');// Import the Mongoose library

// Define the schema for individual questions
const questionSchema = mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} must have exactly 3 options']
    }
});

// Custom validation function to ensure each question has exactly 3 options
function arrayLimit(val) {
    return val.length === 3;
}

// Define the schema for quizzes, embedding the question schema
const quizSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true,
    },
    questions: {
        type: [questionSchema],
        required: true,
        validate: [arrayLimit5, '{PATH} must have exactly 5 questions']
    }
});

// Custom validation function to ensure each quiz has exactly 5 questions
function arrayLimit5(val) {
    return val.length === 5;
}

// Export the mongoose model for 'quiz' using the defined schema
module.exports = mongoose.model('quiz', quizSchema);
