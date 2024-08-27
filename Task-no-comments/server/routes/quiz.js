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
    const authHeader = req.headers.authorization 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(
            {message: 'Access denied. No token provided.'})
    }
    const token = authHeader.split(' ')[1];

    try {
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

        // Find the quiz by its ID and populate the 'userId' field with the 'username'
        const quiz = await Quiz.findById(id).populate('userId', 'username');

        if (!quiz) {
            // If not found, respond with a 404 Not Found status
            return res.status(404).json({ message: 'Quiz not found' });
        }
      

        res.json(quiz);// Send the quiz object as a JSON response
        console.log(quiz);
    } 
    catch (error) {
        console.error('Error finding quiz:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes', checkJwtToken,  async (req, res) => {
    // console.log('Finding Quizzes')
    try {
       // Find all quiz documents in the database and populate the 'userId' field with the 'username'
        const quizzes = await Quiz.find({}).populate('userId', 'username');
        res.json({quizList: quizzes})  
        console.log(quizzes);
    } 
    catch (error) 
    {
        console.error('Error finding quizzes:', error.message);
        res.status(500).json(
            { message: error.message });
    }
});


//------------POST--------------
//Route to add new quiz
router.put('/editQuiz/:id', checkJwtToken, async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const { name, questions } = req.body;

    if (questions.length !== 5) {
        return res.status(400).json({ message: 'You must have exactly 5 questions.' });
    }

    if (!name || !Array.isArray(questions) || questions !== 5) {
        return res.status(400).json({ message: 'Quiz name and questions are required' });
    }

    try {
        for (const questions of questions) {
            if (!question.questionText || !questions.correctAnswer || questions.options.length !== 3) {
                return res.status(400).json({ message: 'Each question must have a question, correct answer, and 3 options' });
            }
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id,
            { name, questions },
            { new: true }
        );

        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json({ updatedQuiz });
        console.log(updatedQuiz);
    } catch (error) {
        console.error('Error editing quiz:', error);
        return res.status(500).json({ error: error.message });
    }
});



//-------------------PUT--------------------------
// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken,  async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const { name, questions } = req.body;

    if (!name || !Array.isArray(questions) || questions !== 5 ) {
        return res.status(400).json(
            { message: 'Quiz name, and  questions are required' }
        );
    }

    try {
        for(const question of questions){
            if (question.options.length !== 3) {
                return res.status(400).json({
                    message: 'Each question must have exactly 3 options',
                });
            }
        }

        // Update the quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id, 
            {name, questions},
            {new: true,}
        );

        if (!updatedQuiz) {            
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json({updatedQuiz})
    } 
    catch (error) {
        console.error('Error editing quiz:', error);
        return res.status(500).json({ error: error.message });
    };
});


//--------DELETE---------------
router.delete('/deleteQuiz/:id', checkJwtToken, async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid quiz ID' });
        }

        const deletedQuiz = await Quiz.findByIdAndDelete(id);

        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        console.log(deletedQuiz);

        res.status(200).json({ message: 'Quiz successfully deleted' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router; 
