// Import necessary modules and packages
const express = require('express');// Import Express to handle routing
const router = express.Router(); // Create a new router object
const mongoose = require('mongoose');// Import Mongoose for MongoDB interaction
// Import schemas
const Score = require('../models/scoreSchema');//Import the Score model
const User = require('../models/userSchema');// Import the User model
const Quiz = require('../models/quizModel');// Import the Quiz model
const { checkJwtToken } = require('./middleware')//Import Custon middleware

//=======SETUP MIDDLEWARE===========
// Setup middleware
mongoose.set('strictPopulate', false); // Disable strict population checks in Mongoose


//=============ROUTES=====================
//-------------GET-----------------
//Find userScore for a specific quiz 
router.get('/findQuizScores/:quizName/:username',checkJwtToken, async (req, res) => {
    // console.log('Finding quiz score');
    
    try {
        const { quizName, username } = req.params; // Extract quizName and username from the route parameters

        // Fetch the score for the specified quiz and user
        const quizScore = await Score.findOne({username, name: quizName})
        .exec();

        //Conditional rendering to check if a score is fount
        if (!quizScore) {
            // If no score is found, return a 404 error
            return res.status(404).json({ error: 'Score not found' });
        }

        res.status(200).json({ success: true, quizScore });    // Return the quiz score in JSON format
        console.log(quizScore);    // Log the fetched score in the console for debugging purposes
    } 
    catch (error) {
        console.error('Error finding quiz score:', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });// Return 500 status code for server error
    }
})

// Route to get all quiz scores
router.get('/findScores', async (req, res) => {
    try {
        const {username} = req.query;// Extract username from query parameters
        // const { username } = req.params;// Extract username from route parameters


        //Conditional rendering 
        if (username && typeof username !== 'string') {
            return res.status(400).json({success: false, message: 'Username must be a string'})
        }

        //Fetch all existing quiz names
        const quizNames = await Quiz.find({}).select('name').exec()
        const existingQuizName = quizNames.map(q => q.name)
        //Delete the userScore if the quiz does not exist
        await Scores.deleteMany({name: {$nin : existingQuizName}})
               
        let userScores;// Declare a variable to store the quiz scores

        // Conditional rendering to check if a username is provided
        if (username) {
            // Find all scores for the user based on the username
             userScores = await Score.find({username}).exec(); 

        } else {
            //Find all scores if no username is provided
             userScores = await Score.find().exec(); 
        }
        res.json(userScores)//Return the fetched scores in JSON format
        console.log(userScores);//Log the fetched scores in the console for debugging puroses
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user scores', error });// Return 500 status code for server error
        console.error({ message: 'Error fetching user scores', error });//Log an error message in the console for debugging purposes
        
    }
})

// Route to fetch all scores for a single user
router.get('/findScores/:username', async (req, res) => {
    try {
        const { username } = req.params; // Extract username from query parameters

        if (!username) {
            return res.status(400).json({success : false, message: 'username is required'})
        }
        // Fetch the user document based on the username
        const user = await User.findOne({ username }).exec();

        // Conditional rendering to check if the user exists
        if (!user) { 
            // If no user is found with the given username, return a 404(Not Found) error
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch the user score based on the user id
        const result = await Score.find({ username: user.username })
            .populate('name') // Populate the quiz name reference if it's a relationship
            .sort({ createdAt: -1 })// Sort the scores by creation date (most recent first)
            .exec()//Execute the query

            res.json(200).json({success: true, data : result})
        // res.json({ userScores: result });// Return the fetched user scores in JSON format        
        console.log(result);//Log the results in the console for debugging
    } catch (error) {
        console.error('Error finding user scores:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, error: error.message });// Return 500 status code for server error
    }
});


//-----------POST----------------------
//Route to add a new score
router.post('/addScore', async(req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purposes
    // console.log(`Request body: ${JSON.stringify(req.body)}`);

    try {
        // Extract username, quiz name, and score from the request body
        const { username, name, score } = req.body;

        //Conditional rendering to check if the datatypes are correct
        if (!username || typeof username !== 'string') {
            return res.status(400).json({ success: false, message: 'Valid username is required.' });
        }
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ success: false, message: 'Valid quiz name is required.' });
        }
        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({ success: false, message: 'Score must be a non-negative number.' });
        }
    
        const quiz = await Quiz.findOne({ name }).exec();// Check if the quiz exists

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
            return res.status(200).json(
                { message: "New score is not higher than the existing score" }
            );
        }

        // let newScore;
        // if (existingScore) {
        //     existingScore.score = score;
        //     existingScore.attempts += 1;
        //     newScore = await existingScore.save();
        // } else {
        //     newScore = await new Score({ username, name, score, attempts: 1 }).save();
        // }

        // If a score exists, update it; otherwise, create a new score
        const newScore = existingScore
            ? await Score.findByIdAndUpdate(
                existingScore._id,
                { score, $inc: { attempts: 1 }},// Increment attempts
                { new: true }// Return the updated score
            )
            : await new Score({ username, name, score }).save();// Create a new score


        // res.status(201).json({ success: true, data: newScore });

        res.status(201).json(newScore)// Save the score and return the result in JSON format
        console.log(newScore);//Log the score in the console for debugging purposes
        
    } 
    catch (error) {
        console.error('Error saving score:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, error: error.message });// Return a 500 (Internal Server Error) response
    }
})

//----------------PUT--------------------
//Route to edit existing score
router.put('/updateScore/:id', checkJwtToken, async (req, res) => {   
    try { 
        const { id } = req.params; // Extract the score ID from route parameters
        const { score } = req.body; // Extract the new score from the request body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid score ID.' });
        }
        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({ success: false, message: 'Score must be a non-negative number.' });
        }

        // Find existing score
        const existingScore = await Score.findById(id).exec();

        //Conditional rendering to check if the score was found
        if (!existingScore) {
            //If no score is found return a 404 (Not Found) response
            return res.status(404).json({ message: 'Score not found' });
        }

        // Conditional rendering to check if new score is higher
        if (existingScore.score >= score) {
            return res.status(200).json({ message: 'New score is not higher than the existing score' });
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

        // existingScore.score = score;
        // existingScore.attempts += 1;
        // const editedScore = await existingScore.save();
        
        // res.status(200).json({ success: true, data: editedScore });
        // Return the updated score in JSON format
        res.status(200).json(editedScore);
        console.log(editedScore);//Log the edited score in the console for debugging purposes
        
    } 
    catch (error) {
        res.status(500).json({ message: 'Error updating score' });//Return a 500 (Internal Sarver Error) response
        console.error('Error updating score')//Log an error message in the console for debugging purposes
    }
})





// Export the router to be used in other parts of the application
module.exports = router;
