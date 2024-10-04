// Import necessary modules and packages
const mongoose = require('mongoose'); // Import the Mongoose library
// const autopopulate = require('mongoose-autopopulate');// Import the autopopulate plugin for Mongoose

function validateCorrectAnswer(correctAnswer, options) {
    return options.includes(correctAnswer);
}

// Define the schema for quizzes
const quizSchema = new mongoose.Schema({
    //Field for the name of the quiz
    name: {
        type: String,//Define the data type as a String
        required: true,
        unique: true,
        trim: true,
        set: (v) => v.toUpperCase(),
    },   
    
    //Username of the person who created the quiz
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Username is required'],            
        ref: 'User',  
        index: true,
        // autopopulate: true,
    },
    //Field for questions containing an array of objects
    questions: {
        type: [
            {
                //Specify the question text(Question)
                questionText: {
                    type: String,//Define the data type as a String
                    required: [true, 'Question text is required'],    
                    trim: true,
                    set: (v) => v.toUpperCase(),
                },
                //Specify the correct answer
                correctAnswer: {
                    type: String,//Define the datatype as a String
                    required: [true, 'Correct answer is required'], 
                    trim: true,
                },
                //Specify the answer options or the questions
                 options: {
                    type: [String], // Define the data type as an array of Strings
                    required: [true, 'Options are required'], // Indicate that options are required with a custom error message
                    validate: [
                        {
                            validator: function (v) {
                                return v.length === 3; // Ensure exactly 3 options
                            },
                            message: 'Each question must have exactly 3 options',
                        },
                    ],
                     validate: [arrayLimit, '{PATH} must have exactly 3 options']
                    trim: true, // Remove whitespace from each option
                },
                // Custom validator to ensure correctAnswer is among options
                 validate: {
                    validator: function () {
                        return validateCorrectAnswer(this.correctAnswer, this.options);
                    },
                    message: 'Correct answer must be one of the provided options',
                },
            },
        ],
        required: true,//Indicate that the field is required
        /* validate: [
            {
                validator: function (v) {
                    return v.length === 5; // Ensure exactly 5 questions
                },
                message: 'Each quiz must have exactly 5 questions',
            },
        ],*/
        // Custom validation to ensure exactly 5 questions per quiz
        validate: [arrayLimit5, '{PATH} must have exactly 5 questions']
    },   
}, { timestamps: true });
// Automatically adds createdAt and updatedAt fields


/* Custom validation function to ensure each 
question has exactly 3 options*/
function arrayLimit(val) {
    return val.length === 3; 
}

/* Custom validation function to ensure 
each quiz has exactly 5 questions*/
function arrayLimit5(val) {
    return val.length === 5;
}

/* Create an index for userId to improve query 
performance when filtering quizzes by user*/
quizSchema.index({userId: 1})

// Apply the autopopulate plugin to the schema
// quizSchema.plugin(autopopulate);


// Export the mongoose model for 'Quiz' using the defined schema
module.exports = mongoose.model('Quiz', quizSchema);
