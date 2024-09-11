// Import necessary modules and packages
const express = require('express');
const router = express.Router();
const cors = require('cors');
// Import the jsonwebtoken module for handling JSON Web Tokens
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
//Schemas
const Quiz = require('../models/quizModel');
const bodyParser = require('body-parser');

//=======SETUP MIDDLEWARE===========
router.use(cors());
router.use(express.json());
router.use(bodyParser.urlencoded({extended:true}))
mongoose.set('strictPopulate', false);

//==============CUSTOM MIDDLEWARE======================
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //Conditional rendering
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(
            { message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify( token,'secretKey',);
        req.user = decoded; 
        console.log('Token provided');
        next();
    } 
    catch (error) {
        //Error handling
        console.error('No token attatched to the request');
        res.status(400).json({ message: 'Invalid token.' });
    }
}


//=============ROUTES====================
//------------------GET---------------
//Route to GET a specific quiz using the quiz Id
router.get('/findQuiz/:id', checkJwtToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quiz ID'
            });
        }

        const quiz = await Quiz.findById(id)
        .populate('userId', 'username')
        .exec()//Execute the query
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(quiz);
        console.log(quiz);
    }
    catch (error) {
        console.error('Error finding quiz:', error.message);
        res.status(500).json({ message: error.message });
    }
});
     

// Route to fetch all the quizzes from the database
router.get('/findQuizzes', checkJwtToken,  async (req, res) => {
    // console.log('Finding Quizzes');
    try {   
        const quizzes = await Quiz.find({}).
            populate('userId', 'username')
            .exec(); 
        res.json({ quizList: quizzes }) 
        // console.log(quizzes);
    } 
    catch (error) {//Error handling
        console.error('Error finding quizzes:', error.message);
        res.status(500).json({ message: error.message })
    }
});


//------------POST--------------
//Route to add new quiz
router.post('/addQuiz', async (req, res) => {
    console.log(req.body);
    // Extract the quiz details from the request body
    const { name, questions/*,username */ } = req.body;

    // Conditional rendering to check that the quiz has a name and exactly 5 questions
    if (!name || !questions || questions.length !== 5) {
        return res.status(400).json({
            message: 'Quiz name and exactly 5 questions are required'
        });
    }

    try {           
        // Conditional rendering to check if a quiz with the same name already exists
        const existingQuiz = await Quiz.findOne({name});

        if (existingQuiz) {
            return res.status(400).json({message: 'Quiz name already exists'})
        }        
        
        // Create a new Quiz document with the provided details
        const newQuiz = new Quiz({name, questions});
        
        const savedQuiz = await newQuiz.save();// Save the new quiz to the database
        // Send the saved quiz as a response with a 201 Created status
        res.status(201).json(savedQuiz);
        console.log(savedQuiz);

    } 
    catch (error) {
        console.error('Error occurred while adding new quiz:', error);
        res.status(500).json({ error: error.message });
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

    // Conditional rendering to check that exactly 5 questions are provided
    if (questions.length !== 5) {
        return res.status(400).json(
            { message: 'You must have exactly 5 questions.' });
    }

    // Conditional rendering to check that the name and questions are properly provided
    if (!name || !Array.isArray(questions) || questions.length !== 5) {
        return res.status(400).json({
            message: 'Quiz name and exactly 5 questions are required' 
        });
    }
    
    try {
        for (const question of questions) {
            if (!question.questionText || !question.correctAnswer || question.options.length !== 3) {
                return res.status(400).json(
                    {message: 'Each question must have a question text, a correct answer, and exactly 3 options'});
            }
        }

        // Update the quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id,
            { name, questions },
            { new: true, }
        );

        if (!updatedQuiz) { 
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json({ updatedQuiz });//Send the updated quiz data in the response
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
        //Conditional rendering to check the quiz Id format 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: 'Invalid quiz ID'});
        }

        // Find the quiz by its ID and delete it from the database
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) {
            return res.status(404).json({message: 'Quiz not found'});
        }
        console.log('Deleted Quiz:', deletedQuiz);
        // Respond with a 200 OK status and a success message
        res.status(200).json({ message: 'Quiz successfully deleted' });
    } 
    catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);
        return res.status(500).json({ message: 'Internal Server Error'});
    }
});

// Export the router to be used in other parts of the application
module.exports = router; 
