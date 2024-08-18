// Import necessary modules and packages
const express = require('express'); 
const router = express.Router();
const cors = require('cors');
// Import JSON Web Token for authentication
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
router.get('/findQuiz/:id', checkJwtToken, async (req, res) => {
    // console.log('Finding Quiz');
    try {
        const quiz = await Quiz.findById(req.params.id).populate('username');
        // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        //     return res.status(400).json({ success: false, message: 'Invalid quiz ID' });
        // }
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json( quiz );
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
        // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        //     return res.status(400).json({ success: false, message: 'Invalid quiz ID' });
        // }
        const quizzes = await Quiz.find({}).populate('user')//populate('username');
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
router.post('/addQuiz', async (req, res) => {
    console.log(req.body)
     // const { name, questions, username } = req.body;
  try {
    // const token = req.headers.authorization.split(' ')[1];
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { name, questions, username } = req.body;

    if (!name || !Array.isArray(questions) || questions.length !== 5) {
      return res.status(400).json({ success: false, message: 'Invalid quiz data' });
    }

    // Conditional rendering to check if username exists
    if (!mongoose.Types.ObjectId.isValid(username)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const newQuiz = new Quiz({ name, questions, username });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error adding quiz:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/addQuiz', async (req, res) => {
    console.log(req.body);
    
    const { name, questions, username } = req.body;   
   if(!name || !questions || questions.length !== 5) {
        return res.status(400).json({ message: 'Quiz name and exactly 5 questions are required' });
    }


      // Conditional rendering to check that each question has exactly 3 options
    for (const question of questions) {
        if (question.options.length !== 3) {
            return res.status(400).json({
                message: 'Each question must have exactly 3 options',
            });
        }
    }
    try {       
        const existingQuiz = await Quiz.findOne({name});
        if (existingQuiz) {
            return res.status(400).json(
                {message: 'Quiz name already exists'})
        }        
        
        // Create a new quiz object
        const newQuiz = new Quiz({ name, questions, username});
        const savedQuiz = await newQuiz.save();
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
    const { id } = req.params;
    const { name, questions } = req.body;

    if (!name || !Array.isArray(questions) || !questions !== 5 ) {
        return res.status(400).json(
            { message: 'Quiz name, and  questions are required' }
        );
    }

    try {
        //Validate that each question has exactly 3 options
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
            { name, questions },
            { 
                new: true, 
            }
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
// Route to delete a quiz
router.delete('/deleteQuiz/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        
        if (!deletedQuiz) {
            return res.status(404).json
            ({message: 'Quiz not found'})
        }

        res.status(200).json(
            { message: 'Quiz successfully deleted' });
    } 
    catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);
        return res.status(500).json(
            { message: 'Internal Server Error'});
    }
});


module.exports = router; 
