const mongoose = require('mongoose'); // Import the Mongoose library


// Define the schema for quizzes
const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    questions: {
        type: [
            {
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
            }
        ],
        required: true,
        validate: [arrayLimit5, '{PATH} must have exactly 5 questions']
    }
}, { timestamps: true });

// Custom validation function to ensure each question has exactly 3 options
function arrayLimit(val) {
    return val.length === 3;
}

// Custom validation function to ensure each quiz has exactly 5 questions
function arrayLimit5(val) {
    return val.length === 5;
}

// Export the mongoose model for 'Quiz' using the defined schema
module.exports = mongoose.model('quiz', quizSchema);
