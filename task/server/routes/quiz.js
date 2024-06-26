const express = require('express');
const router = express.Router();
const cors = require('cors');
const Quiz = require('../models/quizSchema')

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
/* 
=>Fetch quiz(GET)
=> fetch all quizzes(GET
=> fetch score/s(GET)
=>addscores(POST)
=>Deletequiz(DELETE)
= AddQuiz(POST)
=> EditQuiz(PUT)
=> 
*/
//------------------GET---------------
// Get all quizzes
router.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find({});
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//------------POST----------------
//Route to add new quiz
router.post('/addQuiz', async (req, res) => {
    console.log(req.body);
    // console.log('Add Quiz');
    try {
        const quiz = new Quiz(req.body)

        const user = await User.findById(req.user.userId)

        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        // Create a new Quiz instance
        const newQuiz = new Quiz({
            quizName,
            user: user._id, // Reference the user's ObjectId
            questions
        });


        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
    } catch (error) {
        console.error(`Error occured while adding new Task`);
        return res.status(500).json({ message: 'Internal Server Error' });

    }
})
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
//-------------PUT---------------

//--------------DELETE----------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Quiz.findByIdAndDelete(id);

        if (!removedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json({ message: 'Quiz successfully deleted' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
module.exports =router; // Export the router to be used in other parts of the application
