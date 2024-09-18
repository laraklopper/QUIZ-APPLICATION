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

//=========CUSTOM MIDDLEWARE===========
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //Conditional rendering
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // If there's no token or it doesn't start with 'Bearer', return a 401 response
        return res.status(401).json(
            { message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];// Extract the authorization header

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(
            token, 
            'secretKey' 
            /*process.env.JWT_SECRET*/,//secret key used for signing the token stored in enviromental variables
        );
        req.user = decoded; // Attach decoded user information to the request object
        // req.userId = decoded.userId;
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
//Find userScore for a specific quiz for a specific user by username and quizname
router.get('/findQuizScores/:quizName/:username', checkJwtToken, async (req, res) => {
    // console.log('Finding quiz score');//Log a message in the console for debugging purposes
    
    try {
        const { quizName, username } = req.params;// Extract quiz name and username from the request parameters

        // Query the Score collection to find the user's score for the specified quiz
        const quizScore = await Score.findOne({ name: quizName, username })//The findOne() method is used to search for a single document that matches the given criteria
            .exec();

      //Conditional rendering to check if a score exists
        if (!quizScore) {
             // If the score is not found, return a 404 response
            return res.status(404).json({ error: 'Score not found' });
        }

        res.json(quizScore);// Return the quiz score in JSON format
        console.log(quizScore);// Log the score in score for debugging purposes    
    } 
    catch (error) {
        console.error('Error finding quiz score:', error.message);//Log an error message in the console for debugging purpose
        res.status(500).json({ message: error.message });// Return a 500 (Internal Server Error) response for server issues
    }
});

// Route to fetch all scores for a single user
router.get('/findScores/:username', async (req, res) => {
    try {
        const { username } = req.params; // Extract username from route parameters

        // Fetch the user document based on the username
        const user = await User.findOne({ username }).exec();
        //Conditional rendering to check if the user exists
        if (!user) { 
            // Send a 404(Not Found) response if the user does not exist
            return res.status(404).json({ error: 'User not found' });
        }
        // Fetch the user score based on the user id
        const result = await Score.find({ username: user.username })
            .populate('name')//quizName
            .sort({ createdAt: -1 });// Sort the results by creation date in descending order

        res.json({ userScores: result });        
        console.log(result);
    } catch (error) {
        console.error('Error finding user scores:', error);//Log an error message in the console for debugging purpose
        return res.status(500).json({ error: error.message });//send a 500 (Internal Server Error) response if something goes wrong
    }
});


//-----------POST----------------------
//Route to add a new score
router.post('/addScore', async(req, res) => {
    console.log(req.body);

    try {
        const { username, name, score} = req.body
        // Conditional rendering to check if a score already exists for the user and quiz
        const existingScore = await Score.findOne({username, name}).exec();

        if (existingScore && existingScore.score >= score) {
            return res.status(200).json({ message: "New score is not higher than the existing score" });
        }

        const newScore = existingScore
            ? await Score.findByIdAndUpdate(
                existingScore._id,
                { score, $inc: { attempts: 1 } },
                { new: true }
            )
            : await new Score({ username, name, score }).save();


        // If no existing score, create a new one
        // const newScore = new Score({username, name, score})

        const savedScore = await  newScore.save();

        res.status(201).json(savedScore)
        console.log(savedScore);
        
    } 
    catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: error.message });
    }
})
//----------------PUT--------------------
//Route to edit existing score
router.put('/updateScore/:id', async (req, res) => {   
    try { 
        const { id } = req.params
        const { score } = req.body;

        const editedScore = await Score.findByIdAndUpdate(
            id,
            // {score},
            { score, $inc: { attempts: 1 }},
            { new: true } // Return the updated document
        );

        
        if (!editedScore) { 
            res.status(404).json({ message: 'Score not found' });            
        };
        
        res.status(200).json(editedScore);
    } catch (error) {
        res.status(500).json({ message: 'Error updating score' });
        console.error('Error updating score')
    }
})

// Export the router to be used in other parts of the application
module.exports = router;


