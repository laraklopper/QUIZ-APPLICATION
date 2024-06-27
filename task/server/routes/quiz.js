// Import necessary modules and packages
const express = require('express');
const router = express.Router();
const cors = require('cors');
//Schemas
const Quiz = require('../models/quizSchema')
const User = require('../models/userSchema')

//=======SETUP MIDDLEWARE===========
router.use(cors())
router.use(express.json())


//=============ROUTES=====================
/*
|================================================|
| CRUD OPERATION | HTTP VERB | EXPRESS METHOD    |
|================|===========|===================|
|CREATE          | POST      |  router.post()    |
|----------------|-----------|-------------------|
|READ            | GET       |  router.get()     |  
|----------------|-----------|-------------------|     
|UPDATE          | PUT       |  router.put()     |
|----------------|-----------|-------------------|
|DELETE          | DELETE    |  router.delete()  |
|================|===========|===================|
*/

//------------------GET---------------
//=> fetch score/s
//Route to GET a specific quiz
router.get('/quiz/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        res.json(quiz)
    }
    catch (error) {
        res.status(500).json(
            { message: error.message }
        );
    }
});

// Get all quizzes
router.get('/findquizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find({});
        res.json(quizzes);
    } 
    catch (error) {
        res.status(500).json(
            { message: error.message }
        );
    }
});


//------------POST--------------
// Save quiz results
router.post('/user/:id/result', async (req, res) => {
    try {
        const { quizId, score } = req.body;
        // Logic to save results in the database
        res.status(200).json({ message: 'Result saved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Route to add new quiz
router.post('/addQuiz', async (req, res) => {
    console.log(req.body);// Log the incoming request body in the console for debugging purposes
    console.log('Add Quiz');// Log a message in the console indicating the route is being accessed for debugging purposes
    try {

        const user = await User.findById(req.user.userId)// Find the authenticated user by ID

        //Conditional rendering to check if the user is found
        if (!user) {
            // If user not found, return error response
            return res.status(400).json({ error: 'User not found' })
        }

        // Create a new Quiz instance
        const newQuiz = new Quiz({
            quizName: req.body.quizName,// Set quiz name from request body
            user: user._id, // Associate the quiz with the authenticated user
            questions: req.body.questions// Set questions from request body
        });


        const savedQuiz = await newQuiz.save();// Save the new quiz instance to the database

        res.status(201).json(savedQuiz);// Respond with 201 status (Created) and the saved quiz object

    } catch (error) {
        console.error(`Error occured while adding new Task`);//Log an error message in the console for debugging purposes
        return res.status(500).json({ message: 'Internal Server Error' });// Return a 500 Internal Server Error response

    }
})
//---------PUT-----------
// Route to edit a quiz
router.put('/editQuiz/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedQuiz);
    } 
    catch (error) {
        console.error('Error editing quiz:', error);
        return res.status(500).json(
            { message: 'Internal Server Error' }
        );
    }
});
//--------DELETE---------------

// Route to delete a quiz
router.delete('/deleteQuiz/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Quiz.findByIdAndDelete(id);

        if (!removedQuiz) {
            return res.status(404).json(
                { message: 'Quiz not found' }
            );
        }

        res.status(200).json(
            { message: 'Quiz successfully deleted' }
        );
    } 
    catch (error) {
        console.error('Error deleting quiz:', error);
        return res.status(500).json(
            { message: 'Internal Server Error' }
        );
    }
});

module.exports =router; 