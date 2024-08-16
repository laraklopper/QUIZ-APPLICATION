const mongoose = require('mongoose'); // Import the Mongoose library

// Define the schema for quizzes
const quizSchema = new mongoose.Schema({
    //Field for the name of the quiz
    name: {
        type: String,
        required: true,
        unique: true,
    },
    /* Username of the person who created the quiz
    username: {
        type: String, 
        required: true, 
    },*/
    //Field for questions containing an array of objects
    questions: {
        type: [
            {
                //Specify the question text(Question)
                questionText: {
                    type: String,
                    required: true,
                    unique: true,
                },
                //Specify the correct answer
                correctAnswer: {
                    type: String,
                    required: true,
                    unique:true,
                },
                //Specify the answer options for the questions
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
    // Username of the person who created the quiz
    username:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
}, { timestamps: true });

Quiz.findOne()
    .populate('username')
    .exec((err, username)=>{
        if(!err){
            console.log(username)
        }
        process.exit(0)
    })
// Custom validation function to ensure each question has exactly 3 options
function arrayLimit(val) {
    return val.length === 3;
}

// Custom validation function to ensure each quiz has exactly 5 questions
function arrayLimit5(val) {
    return val.length === 5;
}

// Export the mongoose model for 'Quiz' using the defined schema
module.exports = mongoose.model('Quiz', quizSchema);
