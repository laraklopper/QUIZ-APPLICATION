// Import necessary modules and packages
const express = require('express');// Import Express to handle routing
const router = express.Router(); // Create a new router object
const cors = require('cors');// Import CORS middleware to handle cross-origin requests
const mongoose = require('mongoose');// Import Mongoose for MongoDB interaction
// Import schemas
const Score = require('../models/scoreSchema');// Import the Score model
const User = require('../models/userSchema');// Import the User model
const Quiz = require('../models/quizModel');// Import the Quiz model

//=======SETUP MIDDLEWARE===========
// Setup middleware
router.use(cors()); // Enable CORS for cross-origin requests
router.use(express.json()); // Parse incoming JSON requests
router.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
mongoose.set('strictPopulate', false); // Disable strict population checks in Mongoose

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
//-------------GET-----------------
// Route to fetch scores for a single user
router.get('/findScores/:username', async (req, res) => {
    try {
        const { username } = req.params; // Extract username from route parameters

        // Fetch the user document based on the username
        const user = await User.findOne({ username }).exec();
        //Conditional rendering to check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Send a 404(Not Found) response if the user does not exist
        }
        // Fetch the user score based on the user id
        const result = await Score.find(// Find scores where userId matches the fetched user._id
            { userId: (await User.findOne({ username }))._id })
            .populate('quizId')// Populate quizId field with quiz details
            .populate('userId')// Populate userId field with user details
            .sort({ createdAt: -1 });// Sort the results by creation date in descending order

        res.json({ userScores: result });        // Return the user scores in the response
        // console.log(result);
        
    } catch (error) {
        console.error('Error finding user scores:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ error: error.message });// Return a 500 (Internal Server Error) status response
    }
});

// Route to fetch all scores
router.get('/allScores', async (req, res) => {
    try {
        // Fetch all score documents from the database
        const allScores = await Score.find()// Find all score entries
            .populate('quizId')// Populate the quizId field with details from the Quiz collection
            .populate('userId')// Populate the userId field with details from the User collection
            .sort({ createdAt: -1 });// Sort the results by creation date in descending order
        // Return the fetched scores in the response
        res.json({ allScores });
    } catch (error) {
        console.error('Error fetching all scores:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ error: error.message });// Return a 500 (Internal Server Error) status response
    }
});

// Route to find a specific user's score for a quiz
/*router.post('/findQuizScores', async (req, res) => {
    try {
        const { username, quizId } = req.body;

        if (!username || !quizId) {
            return res.status(400).json({ error: 'Username and quizId are required' });
        }
        
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const score = await Score.findOne({ userId: user._id, quizId });
        if (!score) return res.status(404).json({ error: 'Score not found' });

        res.json(score);
    } catch (error) {
        console.error('Error finding quiz score:', error);
        return res.status(500).json({ error: error.message });
    }
});*/
//-----------POST----------------------
//Route to add a new score
//Route to add a new score
 /*router.post('/addScore', async (req, res) => {
    console.log(req.body); // Log the request body for debugging purposes

    try {
        const {
            username, // Extract username from request body
            name,     // Extract quiz name from request body
            score,    // Extract score from request body
            // attempts  // Extract number of attempts from request body
        } = req.body;

        // Conditional rendering
        if (!username || !name || score === undefined || isNaN(score)) {
            return res.status(400).json({
                // Return a 400 (Bad request) response error if validation fails
                error: 'Username, quiz name, and a valid score are required.',
            });
        }

        // Fetch user and quiz
        const user = await User.findOne({ username }).exec();
        if (!user) {
            throw new Error('User not found'); // Throw error if user is not found
        }


        //Fetch the Quiz by the quizName
        const quiz = await Quiz.findOne({ name }).exec();
        if (!quiz) {
            throw new Error('Quiz not found');// Throw error if quiz is not found
        }

        // Check if a score entry for this user and quiz already exists
        const existingScore = await Score.findOne(
            { userId: user._id, quizId: quiz._id }).exec();

        if (existingScore) {
            // Update existing score if the new score is higher
            if (score > existingScore.score) {
                existingScore.score = score;// Update score
                // existingScore.attempts += 1; // Increment attempts
                const updatedScore = await existingScore.save();// Save updated score
                await updatedScore.populate('userId quizId').execPopulate();// Populate userId and quizId
                return res.status(200).json(updatedScore);// Return updated score
            } else {
                // Return existing score if the new score is not higher
                await existingScore.populate('userId quizId').execPopulate(); // Populate userId and quizId
                return res.status(200).json(existingScore);// Return existing score
            }
        } else {
            // Create a new score entry
            const newScore = new Score({
                userId: user._id,// Set the userId field to the _id of the user document
                quizId: quiz._id,// Set the userId field to the _id of the user document
                score: Math.floor(score),// Ensure that the value is an integer
                // attempts: attempts || 1// Set the attempts field to the provided value or default to 1 if not provided
            });
            const savedScore = await newScore.save();//Save the new Score
            await savedScore.populate('userId quizId').execPopulate();//Populate the userId
            return res.status(201).json(savedScore);//Return the newly created score
        }
    } catch (error) {
        console.error('Error saving score:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ error: error.message });// Return a 500 (Internal Server Error) status response
    }
});*/
router.post('/addScore', async(req, res) => {
    console.log(req.body);

    try {
        const { username, name, score } = req.body
        const newScore = new Score({username, name, score})

        const savedScore =  newScore.save();

        res.status(201).json(savedScore)
        console.log(savedScore);
        
    } catch (error) {
        console.error('Error saving score:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ error: error.message });// Return a 500 (Internal Server Error) status response
    }
})


//-------------PUT-----------------------
//Route to edit existing score
/*router.put('/updateScore/:id', async (req, res) => {
    try {
        const { _id, score, attemps } = req.body;
        const updatedScore = await Score.findByIdAndUpdate(
            _id,
            { score, attempts },
            { new: true } // Return the updated document
        );
        if (updatedScore) {
            res.json(updatedScore);
        } else {
            res.status(404).json({ message: 'Score not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating score' });
        console.error('Error updating score')
    }
})

})*/
// Export the router to be used in other parts of the application
module.exports = router;
