// Import necessary modules and packages
const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
//Schemas
const Quiz = require('../models/quizModel');

//=======SETUP MIDDLEWARE===========
router.use(cors());
router.use(express.json());
mongoose.set('strictPopulate', false);

//==============CUSTOM MIDDLEWARE======================
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //Conditional rendering
    if (!authHeader || !authHeader.startsWith('Bearer ')) 
        {return res.status(401).json(
            { message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];// Extract the authorization header

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
};


//=============ROUTES====================
//------------------GET---------------
//Route to GET a specific quiz using the quiz Id
router.get('/findQuiz/:id', checkJwtToken, async (req, res) => {
    try {
        const { id } = req.params;// Retrieve the quiz ID from the request parameters

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid quiz ID'
            });
        }
        
        // Find the quiz by its ID and populate the 'userId' field with the 'username'
        // Populate the 'userId' field with the associated 'username' from the User collection
        const quiz = await Quiz.findById(id)
        .populate('userId', 'username')
        .exec()
        
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
    
    try {   
        // Query the database for all quizzes
        // Populate the 'userId' field with the 'username' from the User collection
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
router.post('/addQuiz',  async (req, res) => {
    console.log(req.body);
    // Extract the quiz details from the request body
    const { name, questions /*,username */ } = req.body;

    if (!name || !questions || questions.length !== 5) {
        return res.status(400).json({message: 'Quiz name and exactly 5 questions are required'});
    }

    try {           
        const existingQuiz = await Quiz.findOne({name});

        if (existingQuiz) {
            return res.status(400).json({message: 'Quiz name already exists'})
        }        
        
        // Create a new Quiz document with the provided details
        const newQuiz = new Quiz({
            name,   
            questions,   
            // username
            // createdBy: req.user.userId
        });


        const savedQuiz = await newQuiz.save();// Save the new quiz to the database
       
        // Send the saved quiz as a response with a 201 Created status
        res.status(201).json(savedQuiz);
        console.log(savedQuiz);
    } 
    catch (error) {
        console.error('Error occurred while adding new quiz:', error);
        res.status(500).json({ error: error.message })}
})



//-------------------PUT--------------------------
// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken,  async (req, res) => {
    // Extract quiz ID from the request parameters
    const { id } = req.params;
    console.log(req.body);

    const { name, questions } = req.body;

    if (!name || !Array.isArray(questions) || questions.length !== 5) {
        return res.status(400).json({message: 'Quiz name and exactly 5 questions are required'});
    }
    
    try {
        /* for (const question of questions) {
            if (!question.questionText || !question.correctAnswer || question.options.length !== 3) {
                return res.status(400).json({
                    message: 'Each question must have a question text, a correct answer, and exactly 3 options' 
                });
            }
        }*/

        // Update the quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id, // ID of the quiz to update
            { name, questions },
            { new: true, }
        );

  
        if (!updatedQuiz) {  
           
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
    const { id } = req.params;
    
    try {

        // Find the quiz by its ID and delete it from the database
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        
        if (!deletedQuiz) {
            return res.status(404).json({message: 'Quiz not found'});
        }

        res.json({ message: 'Quiz successfully deleted' })
        console.log('Deleted Quiz:', deletedQuiz);
        // res.status(200).json({ message: 'Quiz successfully deleted' });
    } 
    catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);
        return res.status(500).json({ message: error.message });

    }
});


// Export the router to be used in other parts of the application
module.exports = router; 
