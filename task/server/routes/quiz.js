// Import necessary modules and packages
const express = require('express');// Import Express to handle routing
const router = express.Router();// Create a new router object
const cors = require('cors');// Import CORS middleware to handle cross-origin requests
// Import the jsonwebtoken module for handling JSON Web Tokens
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');// Import Mongoose for MongoDB interaction
//Schemas
const Quiz = require('../models/quizModel');// Import the Quiz model
const Score = require('../models/scoreSchema')
//=======SETUP MIDDLEWARE===========
// Setup middleware
router.use(cors()); // Enable CORS for cross-origin requests
router.use(express.json()); // Parse incoming JSON requests
mongoose.set('strictPopulate', false); // Disable strict population checks in Mongoose

//==============CUSTOM MIDDLEWARE======================
//Middleware to verify the JWT token
const checkJwtToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    //Conditional rendering
    if (!authHeader || !authHeader.startsWith('Bearer ')) 
        {return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];// Extract the authorization header

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify( token,'secretKey',);
        req.user = decoded; // Attach decoded user information to the request object
        console.log('Token provided');
        next();
    } 
    catch (error) {
        //Error handling
        console.error('No token attatched to the request');//Log an error message in the console for debugging purposes
        res.status(400).json({ message: 'Invalid token.' });
    }
};

/*
//Middleware to delete all scores for the quiz if the quiz is deleted
const deleteQuizScores= async (req, res, next) => {
    
}*/
//=============ROUTES====================
//------------------GET---------------
//Route to GET a specific quiz using the quiz Id
router.get('/findQuiz/:id', checkJwtToken, async (req, res) => {
    try {
        const { id } = req.params;// Retrieve the quiz ID from the request parameters

        if (!mongoose.Types.ObjectId.isValid(id)) {
            // If not valid, respond with a 400 Bad Request status and an error message
            return res.status(400).json({
                success: false,
                message: 'Invalid quiz ID'
            });
        }
        
        // Find the quiz by its ID and populate the 'userId' field with the 'username'
        // Populate the 'userId' field with the associated 'username' from the User collection
        const quiz = await Quiz.findById(id)
        .populate('userId', 'username')// Populate the userId field with the username
        .exec()//Execute the query
        
        //Conditional rendering to check if the quiz is found
        if (!quiz) {
            // If the quiz is not found, respond with a 404 Not Found status and an error message
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(quiz); // If the quiz is found, send it as the JSON response
        console.log(quiz);// Log the quiz in the console for debugging purposes
    }
    catch (error) {
        console.error('Error finding quiz:', error.message); // Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });// Respond with a 500 Internal Server Error status and the error message
    }
});
     


// Route to fetch all the quizzes from the database
router.get('/findQuizzes',   async (req, res) => {
    try {  
        // Query the database for all quizzes
        // Populate the 'userId' field with the 'username' from the User collection
        const quizzes = await Quiz.find({}).
            populate('userId', 'username') // Populate the 'userId' field with 'username'
            .exec(); //Execute the query
        res.json({ quizList: quizzes }) // Send the list of quizzes in the response as JSON
        // console.log(quizzes);//Log the quizzes in the console for debugging purposes
    } 
    catch (error) 
    {//Error handling
        console.error('Error finding quizzes:', error.message);// Log an error message in the console for debugging purposes
        res.status(500).json(
            { message: error.message });// Respond with a 500 Internal Server Error status and the error message
    }
});

//------------POST--------------
//Route to add new quiz
router.post('/addQuiz',  async (req, res) => {
    console.log(req.body);
    // Extract the quiz details from the request body
    const { name, questions /*,username */ } = req.body;

    // Conditional rendering to check that the quiz has a name and exactly 5 questions
    if (!name || !questions || questions.length !== 5) {
        return res.status(400).json({message: 'Quiz name and exactly 5 questions are required'});
    }

    try {           
        // Conditional rendering to check if a quiz with the same name already exists
        const existingQuiz = await Quiz.findOne({name});

        if (existingQuiz) {
            return res.status(400).json({message: 'Quiz name already exists'})
        }        
        
        // Create a new Quiz document with the provided details
        const newQuiz = new Quiz({
            name,         // The name of the quiz
            questions,    // Array of questions for the quiz
            // username
            // createdBy: req.user.userId
        });


        const savedQuiz = await newQuiz.save();// Save the new quiz to the database
        
        res.status(201).json(savedQuiz);// Send the saved quiz as a response with a 201 Created status
        console.log(savedQuiz);//Log the saved quiz in the console for debugging purposes
    } 
    catch (error) {
        console.error('Error occurred while adding new quiz:', error);//Log an error message in the console for debugging purposes
        res.status(500).json( // Respond with a 500 Internal Server Error status and the error message
            { error: error.message });
    }
})


//-------------------PUT--------------------------
// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken,  async (req, res) => {
    // Extract quiz ID from the request parameters
    const { id } = req.params;
    console.log(req.body);//Log the request body in the console for debugging purposes

    // Extract name and questions from the request body
    const { name, questions } = req.body;

    // Conditional rendering to check that the name and questions are properly provided
    if (!name || !Array.isArray(questions) || questions.length !== 5) {
        return res.status(400).json({message: 'Quiz name and exactly 5 questions are required'});
    }
    
    try {
        // for (const question of questions) {
        //     if (!question.questionText || !question.correctAnswer || question.options.length !== 3) {
        //         return res.status(400).json({
        //             message: 'Each question must have a question text, a correct answer, and exactly 3 options' 
        //         });
        //     }
        // }

        // Update the quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id, // ID of the quiz to update
            { name, questions },// The updated quiz details 
            { new: true, }// Return the updated document
        );

        //conditional rendering to check if the quiz exists
        if (!updatedQuiz) {  
            // If the quiz is not found, respond with a 404 Not Found status
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json({ updatedQuiz });
        console.log(updatedQuiz);      
    } 
    catch (error) {
        console.error('Error editing quiz:', error);
        return res.status(500).json({ error: error.message });
    };
});


//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id', checkJwtToken,async (req, res) => {
    const { id } = req.params;// Extract quiz ID from the request parameters
    
    try {

        
        // Find the quiz by its ID and delete it from the database
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        
        if (!deletedQuiz) {
            // If the quiz is not found, respond with a 404 Not Found status
            return res.status(404).json({message: 'Quiz not found'});
        }

        // Delete quiz scores
        await Score.deleteMany({name: deletedQuiz.name})

        console.log('Deleted Quiz:', deletedQuiz);// Log the deleted quiz for debugging purposes
        res.json({ message: 'Quiz successfully deleted' })
    } 
    catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ message: error.message });// Respond with a 500 Internal Server Error status

    }
});

// Export the router to be used in other parts of the application
module.exports = router; 