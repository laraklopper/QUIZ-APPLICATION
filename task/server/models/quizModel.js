// Import necessary modules and packages
const mongoose = require('mongoose'); // Import the Mongoose library
// const autopopulate = require('mongoose-autopopulate');// Import the autopopulate plugin for Mongoose

// Define the schema for quizzes
const quizSchema = new mongoose.Schema({
    //Field for the name of the quiz
    name: {
        type: String,//Define the data type as a String
        required: true,//Indicate that the quizName is required 
        unique: true,// The quiz name must be unique (no duplicates allowed)
        //Transform the value to uppercase before saving  
        set: (v) => v.toUpperCase(),// A setter to automatically convert quiz name to uppercase
    },
    //Username of the person who created the quiz
    username:{
        type: String,//Define the datatype as a string
        required: [true, 'Username is required'],
    },
  /*userId: {        
        type: mongoose.Schema.Types.ObjectId,// Define the datatype as ObjectId
        required: [true, 'Username is required'],            
        ref: 'User',  
        autopopulate: true,
    },*/    
    //Field for questions containing an array of objects
    questions: {
        type: [
            {
                //Specify the question text(Question)
                questionText: {
                    type: String,//Define the data type as a String
                    required: true,  //Indicate that the question is required      
                    //Transform the value to uppercase before saving             
                    set: (v) => v.toUpperCase(),// A setter to automatically convert questionText name to uppercase
                },
                //Specify the correct answer
                correctAnswer: {
                    type: String,//Define the datatype as a String
                    required: true,//Indicate that the field is required  
                },
                //Specify the answer options or the questions
                options: {
                    type: [String],//Define the data type as an array of Strings
                    required: true,//Indicate that the field is required
                    // Custom validation to ensure 3 options per question
                    validate: [arrayLimit, '{PATH} must have exactly 3 options']
                }
            }
        ],
        required: true,//Indicate that the field is required
        // Custom validation to ensure exactly 5 questions per quiz
        validate: [arrayLimit5, '{PATH} must have exactly 5 questions']
    },   
}, { timestamps: true });
// Automatically adds createdAt and updatedAt fields


/* Custom validation function to ensure each 
question has exactly 3 options*/
function arrayLimit(val) {
    return val.length === 3; // Validation passes if the array length is 3
}

/* Custom validation function to ensure 
each quiz has exactly 5 questions*/
function arrayLimit5(val) {
    return val.length === 5;// Validation passes if the array length is 5
}

/* Create an index for userId to improve query 
performance when filtering quizzes by user*/
quizSchema.index({userId: 1})

// Apply the autopopulate plugin to the schema
quizSchema.plugin(autopopulate);

// Export the mongoose model for 'Quiz' using the defined schema
module.exports = mongoose.model('Quiz', quizSchema);
