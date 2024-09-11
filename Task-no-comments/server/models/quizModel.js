// Import necessary modules and packages
const mongoose = require('mongoose'); // Import the Mongoose library
// Import the autopopulate plugin for Mongoose
const autopopulate = require('mongoose-autopopulate');

// Define the schema for quizzes
const quizSchema = new mongoose.Schema({
    //Field for the name of the quiz
    name: {
        type: String,
        required: true,
        unique: true,
        set: (v) => v.toUpperCase(),
    },
    //Username of the person who created the quiz
    userId: {        
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Username is required'],              
        ref: 'User',  
        autopopulate: true,
    },
      /*
    username:{
        type: String,
        required: true,
    }
    */
    //Field for questions containing an array of objects
    questions: {
        type: [
            {
                //Specify the question text(Question)
                questionText: {
                    type: String,
                    required: true,                    
                    set: (v) => v.toUpperCase(),
                },
                //Specify the correct answer
                correctAnswer: {
                    type: String,
                    required: true,
                },
                //Specify the answer options or the questions
                options: {
                    type: [String],
                    required: true,
                    validate: [arrayLimit, '{PATH} must have exactly 3 options']
                }
            }
        ],
        required: true,
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

quizSchema.index({userId: 1})
// Apply the autopopulate plugin to the schema
quizSchema.plugin(autopopulate);

// Export the mongoose model for 'Quiz' using the defined schema
module.exports = mongoose.model('Quiz', quizSchema);
