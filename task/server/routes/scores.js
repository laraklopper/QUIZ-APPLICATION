// Import necessary modules and packages
const express = require('express');// Import Express to handle routing
const router = express.Router(); // Create a new router object
const cors = require('cors');// Import CORS middleware to handle cross-origin requests
const mongoose = require('mongoose');// Import Mongoose for MongoDB interaction
// Import schemas
const Score = require('../models/scoreSchema');//Import the Score model
const User = require('../models/userSchema');// Import the User model
const Quiz = require('../models/quizModel');// Import the Quiz model
const { checkJwtToken } = require('./middleware')//Import Custon middleware
//=======SETUP MIDDLEWARE===========
// Setup middleware
router.use(cors()); // Enable CORS for cross-origin requests
router.use(express.json()); // Parse incoming JSON requests
mongoose.set('strictPopulate', false); // Disable strict population checks in Mongoose

//=============ROUTES=====================
//-------------GET-----------------
//Find userScore for a specific quiz 
router.get('/findQuizScores/:quizName/:username',  checkJwtToken, async (req, res) => {
    // console.log('Finding quiz score');
    
    try {
        const { quizName, username } = req.params; // Extract quizName and username from the route parameters

        // Fetch the score for the specified quiz and user
        const quizScore = await Score.findOne({username, name: quizName}).exec();

        //Conditional rendering to check if a score is fount
        if (!quizScore) {
            // If no score is found, return a 404 error
            return res.status(404).json({ error: 'Score not found' });
        }

        res.json(quizScore)// Return the quiz score in JSON format
        console.log(quizScore);    // Log the fetched score in the console for debugging purposes
    } 
    catch (error) {
        console.error('Error finding quiz score:', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });// Return 500 status code for server error
    }
})

// Get all scores for the authentica
router.get('/findScores', async (req, res) => {
    try {
        // const userId = req.user._id;
        const  {username} = req.query; //Extract the username from query parameters

        let userScores;
        // Conditional rendering to check if a username is provided, and find scores accordingly
        if(username){
            //Find scores for a specific user 
            userScores = await Score.find({ username }).exec();
        }else{
            // Find all scores if no username is provided
            const userScores = await Score.find(req.body).exec(); 
        }
        
        // Find all scores for the user
        const userScores = await Score.find(req.body).exec(); 
        res.json(userScores)// Return the fetched scores in JSON format
        console.log(userScores);//Log the scores in the console for debugging purposes
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user scores', error });// Return 500 status code for server error
        console.error({ message: 'Error fetching user scores', error });//Log an error message in the console for debugging purposes
        
    }
})

// Route to fetch all scores for a single user
router.get('/findScores/:username', async (req, res) => {
    try {
        const { username } = req.params; // Extract username from route parameters

        // Fetch the user document based on the username
        // Use `findOne` to locate a user with the provided username
        const user = await User.findOne({ username }).exec();

        // Conditional rendering to check if the user exists
        if (!user) { 
                    // If no user is found with the given username, return a 404 error
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch the user score based on the user id
        const result = await Score.find({ username: user.username }) // Find scores matching the username
            .populate('name')// Populate the quiz name field if needed
            .sort({ createdAt: -1 })// Sort scores by creation date in descending order
            .exec()//Execute the query

        res.json({ userScores: result });// Return the user scores in JSON format        
        console.log(result);// Log the fetched scores for debugging purposes
    } catch (error) {
        console.error('Error finding user scores:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ error: error.message });// Respond with a 500 (Internal Server Error) response
    }
});


//-----------POST----------------------
//Route to add a new score
router.post('/addScore', /*checkJwtToken*/, async(req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purposes

    try {
        // Extract username, quiz name, and score from the request body
        const { username, name, score } = req.body;

    
        const quiz = await Quiz.findOne({name}).exec();// Check if the quiz exists

      //Conditional rendering to check if the quiz exists
        if (!quiz) {
            // Return a 404 error if the quiz does not exist
            return res.status(404).json({message: 'Quiz not found'})
        }

        // Conditional rendering to Check if a score already exists for the user and the quiz
        const existingScore = await Score.findOne({ username, name})
        .exec();        
        
        // const existingScore = await Score.findOne({ username, name: quiz._id }).exec();
        
        // If the existing score is higher or equal, don't update
        if (existingScore && existingScore.score >= score) {
            // If the existing score is higher or equal, don't update
            return res.status(200).json(
                { message: "New score is not higher than the existing score" }
            );
        }

       // If a score exists, update it; otherwise, create a new score
        const newScore = existingScore
            ? await Score.findByIdAndUpdate(
                existingScore._id,
                { score, $inc: { attempts: 1 }},// Increment attempts
                { new: true }// Return the updated score
            )
            : await new Score({ username, name/*: quiz._id*/, score }).save();// Create a new score


        res.status(201).json(newScore)// Save the score and return the result in JSON format
        console.log(newScore);//Log the score in the console for debugging purposes
        
    } 
    catch (error) {
        console.error('Error saving score:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ error: error.message });// Return a 500 (Internal Server Error) response
    }
})

//----------------PUT--------------------
//Route to edit existing score
router.put('/updateScore/:id', checkJwtToken, async (req, res) => {   
    try { 
        const { id } = req.params; // Extract the score ID from route parameters
        const { score } = req.body; // Extract the new score from the request body

        // Find existing score
        const existingScore = await Score.findById(id).exec();

        if (!existingScore) {
            return res.status(404).json({ message: 'Score not found' });
        }

        // Conditional rendering to check if new score is higher
        if (existingScore.score >= score) {
            return res.status(200).json(
                { message: 'New score is not higher than the existing score' });
        }
        
        // Find the score by its ID and update it
        const editedScore = await Score.findByIdAndUpdate(
            id,
            { score, $inc: { attempts: 1 } },// Increment attempts 
            { new: true } //Return the updated document
        );

        
        //Conditional rendering to check if the score was successfully updated
        if (!editedScore) { 
            //Return a 404(Not Found) response
            res.status(404).json({ message: 'Score not found' });            
        };
         
        res.status(200).json(editedScore);// Return the updated score in JSON format
        console.log(editedScore);//Log the edited score in the console for debugging purposes
        
    } 
    catch (error) { 
        res.status(500).json({ message: 'Error updating score' });//Return a 500 (Internal Sarver Error) response
        console.error('Error updating score')//Log an error message in the console for debugging purposes
    }
})



// Export the router to be used in other parts of the application
module.exports = router;
