// Import necessary modules and packages
const express = require('express');// Import Express to handle routing
const router = express.Router(); // Create a new router object
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// Import schemas
const Score = require('../models/scoreSchema');
const User = require('../models/userSchema');
const Quiz = require('../models/quizModel');

//=======SETUP MIDDLEWARE===========
// Setup middleware
router.use(cors()); 
router.use(express.json()); 
mongoose.set('strictPopulate', false);


//=========CUSTOM MIDDLEWARE===========
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(
            { message: 'Access denied. No token provided.' });
    }

    // Extract the authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(
            token, 
            'secretKey' 
            /*process.env.JWT_SECRET*/,//Secret key used for signing the token stored in enviromental variables
        );
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


//=============ROUTES=====================
//-------------GET-----------------
//Find userScore for a specific quiz 
router.get('/findQuizScores/:quizName/:username',  checkJwtToken, async (req, res) => {
    // console.log('Finding quiz score');
    
    try {
        const { quizName, username } = req.params;

        const quizScore = await Score.findOne({username, name: quizName}).exec();

        if (!quizScore) {
            return res.status(404).json({ error: 'Score not found' });
        }

        res.json(quizScore)// Return the quiz score in JSON format
        console.log(quizScore);    
    } 
    catch (error) {
        console.error('Error finding quiz score:', error.message);
        res.status(500).json({ message: error.message });
    }
})

// Get all scores for the authentica
router.get('/findScores', async (req, res) => {
    try {
        // const userId = req.user._id;
        
        // Find all scores for the user
        const userScores = await Score.find(req.body).exec(); 
        res.json(userScores)
        console.log(userScores);
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user scores', error });
        console.error({ message: 'Error fetching user scores', error });
        
    }
})

// Route to fetch all scores for a single user
router.get('/findScores/:username', async (req, res) => {
    try {
        // Extract username from route parameters
        const { username } = req.params; 

        // Fetch the user document based on the username
        const user = await User.findOne({ username }).exec();

        if (!user) { 
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch the user score based on the user id
        const result = await Score.find({ username: user.username })
            .populate('name')
            .sort({ createdAt: -1 })
            .exec()

        res.json({ userScores: result });        
        console.log(result);
    } catch (error) {
        console.error('Error finding user scores:', error);
        return res.status(500).json({ error: error.message });
    }
});


//-----------POST----------------------
//Route to add a new score
router.post('/addScore', checkJwtToken, async(req, res) => {
    console.log(req.body);

    try {
        // Extract username, quiz name, and score from the request body
        const { username, name, score } = req.body;

    
        const quiz = await Quiz.findOne({name}).exec();

        if (!quiz) {
            return res.status(404).json({message: 'Quiz not found'})
        }

        // Check if a score already exists for the user and the quiz
        // const existingScore = await Score.findOne({ username, name }).exec();
        const existingScore = await Score.findOne({ username, name: quiz._id }).exec();
        // If the existing score is higher or equal, don't update
        if (existingScore && existingScore.score >= score) {
            return res.status(200).json(
                { message: "New score is not higher than the existing score" }
            );
        }

        // If a score exists, update it; otherwise, create a new score
        const newScore = existingScore
            ? await Score.findByIdAndUpdate(
                existingScore._id,
                { score, $inc: { attempts: 1 }},// Increment attempts
                { new: true }
            )
            : await new Score({ username, name: quiz._id, score }).save();


        // Save the score and return the result in JSON format
        res.status(201).json(newScore)
        console.log(newScore);
        
    } 
    catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: error.message });
    }
})

//----------------PUT--------------------
//Route to edit existing score
router.put('/updateScore/:id', checkJwtToken, async (req, res) => {   
    try { 
        const { id } = req.params
        const { score } = req.body;

        // Find existing score
        const existingScore = await Score.findById(id).exec();

        if (!existingScore) {
            return res.status(404).json({ message: 'Score not found' });
        }

        // Check if new score is higher
        if (existingScore.score >= score) {
            return res.status(200).json(
                { message: 'New score is not higher than the existing score' });
        }
        // Find the score by its ID and update it
        const editedScore = await Score.findByIdAndUpdate(
            id,
            { score, $inc: { attempts: 1 } },// Increment attempts 
            { new: true } 
        );

        
        if (!editedScore) { 
            res.status(404).json({ message: 'Score not found' });            
        };
        
        // Return the updated score in JSON format
        res.status(200).json(editedScore);
    } 
    catch (error) {
        res.status(500).json({ message: 'Error updating score' });
        console.error('Error updating score')
    }
})



// Export the router to be used in other parts of the application
module.exports = router;
