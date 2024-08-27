// Import necessary modules and packages
const express = require('express');// Import Express Web framework
const router = express.Router();// Create an Express router
const cors = require('cors');// Import the cors module to enable Cross-Origin Resource Sharing
// Import the jsonwebtoken module for handling JSON Web Tokens
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');// Import the mongoose module to interact with MongoDB
//Schemas
const Quiz = require('../models/quizModel');//Import the quiz model
// const User = require('../models/userSchema');//Import the user model

//=======SETUP MIDDLEWARE===========
router.use(cors()); // Enable Cross-Origin Resource Sharing
router.use(express.json()); // Parse incoming JSON requests
mongoose.set('strictPopulate', false); // Disable strict population

//==============CUSTOM MIDDLEWARE======================
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization // Retrieve the authorization header from the request
     /* Conditional rendering to check if the authorization header 
    is present and starts with 'Bearer '*/
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(// If not present or incorrect format, respond with 401 Unauthorized
            { message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];// Extract the token from the authorization header

     try {
            // Verify the token using the secret key
            const decoded = jwt.verify( token,'secretKey',);
            // Attach the decoded token data to the request object for use in subsequent middleware/route handlers
            req.user = decoded;
            console.log('Token provided');// Log token validation status in the console for debugging purposes
            next();// Call the next middleware or route handler
        } 
        catch (error) {
            //Error handling
            console.error('No token attatched to the request');//Log an error message in the console for debugging purposes
            res.status(400).json({ message: 'Invalid token.' });// If token verification fails, respond with 400 Bad Request
        }
}

//=============ROUTES====================
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
//Route to GET a specific quiz using the quiz Id
router.get('/findQuiz/:id', checkJwtToken, async (req, res) => {

    try {
        const { id } = req.params;// Retrieve the quiz ID from the request parameters
        // Conditional rendering to check if the ID format using mongoose's ObjectId.isValid method
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // If the ID is invalid, respond with a 400 Bad Request status
            return res.status(400).json({
                success: false,
                message: 'Invalid quiz ID'
            });
        }

        // Find the quiz by its ID and populate the 'userId' field with the 'username'
        const quiz = await Quiz.findById(id).populate('userId', 'username');
        
        // const quiz = await Quiz.findById(id).populate('user');
        // Conditional rendering if the quiz was found
        if (!quiz) {
            // If not found, respond with a 404 Not Found status
            return res.status(404).json({ message: 'Quiz not found' });
        }

       res.json(quiz);// Send the quiz object as a JSON response
        console.log(quiz);// Log the quiz details in the console for debugging purposes
    } 
    catch (error) {
       console.error('Error finding quiz:', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });// If an error occurs, return a 500 Internal Server Error response
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes', checkJwtToken,  async (req, res) => {
    // console.log('Finding Quizzes');//Log a message in the console for debugging purposes
    try {  
        // Find all quiz documents in the database and populate the 'userId' field with the 'username'
        const quizzes = await Quiz.find({}).populate('userId', 'username'); 
        res.json({ quizList: quizzes })  // Send the list of quizzes as a JSON response
        console.log(quizzes);// Log the quizzes in the console for debugging purposes
    } 
    catch (error) 
    {//Error handling
        console.error('Error finding quizzes:', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json(// Respond with a 500 Internal Server Error status and the error message
            { message: error.message });
    }
});



//------------POST--------------
//Route to add new quiz
router.post('/addQuiz',/*checkJwtToken,*/ async (req, res) => {
    console.log(req.body);
    const { name, questions,} = req.body;// Extract the quiz details from the request body
        // const { name, questions/*,username */ } = req.body;// Extract the quiz details from the request body

       /* Conditional rendering to  ensure that a name is provided, 
    questions are present, and there are exactly 5 questions*/
    if (!name || !questions || questions.length !== 5) {
        return res.status(400).json({
            message: 'Quiz name and exactly 5 questions are required'
        });
    }


    /*  for (const question of questions) {   
         // Conditional rendering to check that each question has exactly 3 options
        if (question.options.length !== 3) {
            return res.status(400).json({
                message: 'Each question must have exactly 3 options',
            });
        }
    }
    for (const questions of questions) {
        if (!question.questionText || !questions.correctAnswer || !questions.options.length !== 3) {
            return res.status(400).json(
                { message: 'Each question must have a question , correct answer and 3 options' }
            )
        }
    }*/
    try {               
    // Conditional rendering to check if a quiz with the same name already exists
        const existingQuiz = await Quiz.findOne({name});
        if (existingQuiz) {
            // If a quiz with the given name is found, respond with a 400 Bad Request status
            return res.status(400).json(
                {message: 'Quiz name already exists'})
        }      
        
        // Create a new quiz object
        // Create a new Quiz document with the provided details
        const newQuiz = new Quiz({
            name,         // The name of the quiz
            questions,    // Array of questions for the quiz
            // username,     // The username of the person creating the quiz
             // username: req.user._id 
        });
        
        const savedQuiz = await newQuiz.save();   // Save the new quiz to the database    
        res.status(201).json(savedQuiz);// Respond with the saved quiz and a 201 Created status

        console.log(savedQuiz);// Log the saved quiz in the console for debugging purposes

    } 
    catch (error) {
        console.error('Error occurred while adding new quiz:', error);//Log an error message in the console for debugging purposes
         res.status(500).json(// Respond with a 500 Internal Server Error status and the error message
            { error: error.message });
    }
    }
})


/*
// Route to add new score
router.post('/addScore', async (req, res) => {
    console.log(req.body);
    try {
        const { username, name, score } = req.body;
         if (!username || !quizName || typeof score !== 'number') {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const newScore =({ username, name, score });    
        const existingScore = await Score.findOne({ username, name });


        if (existingScore) {
            existingScore.score = score; 
            const savedScore = await existingScore.save();
            return res.status(201).json(savedScore);
        } else {
           const createdScore = new Score(newScore);
            const savedScore = await createdScore.save();
            return res.status(201).json(savedScore);
        }
    } catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: error.message });
});
*/
//-------------------PUT--------------------------
// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken,  async (req, res) => {
  const { id } = req.params;// Extract quiz ID from the request parameters
    console.log(req.body);//Log the request body in the console for debugging purposes
    const { name, questions } = req.body;// Extract name and questions from the request body


    //Conditional rendering to check the if there are 5 queistions in the quiz
    if (questions.length !== 5) {
        // Return a 400 Bad Request response with an error message if the number of questions is not exactly 5
        return res.status(400).json(
            { message: 'You must have exactly 5 questions.' });
    }

  // Conditional rendering to check the required fields and the structure of questions
    if (!name || !Array.isArray(questions) || questions.length !== 5) {
        return res.status(400).json({
            // Return 400 Bad Request response with an error message if there are missing or invalid fields
            message: 'Quiz name and exactly 5 questions are required' 
        });
    }
    try {
       // Validate each question in the quiz
        for (const question of questions) {
            // Conditional rendering to check if the question has a text, a correct answer, and exactly 3 options
            if (!question.questionText || !question.correctAnswer || question.options.length !== 3) {
                return res.status(400).json({// Error message if any question does not meet the required format
                    message: 'Each question must have a question text, a correct answer, and exactly 3 options' 
                });
            }
        }


       // Update the quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id, // ID of the quiz to update
            { name, questions },// The updated quiz details 
            { new: true, }// Return the updated document
        );

        //Conditional rendering to check if the updated quiz is found
        if (!updatedQuiz) {            
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // res.json({ success: true, quiz: updatedQuiz });
        res.json({ updatedQuiz })// Respond with the updated quiz
        console.log(updatedQuiz); // Log the updated quiz in the console for debugging purposes
    } 
    catch (error) {
          console.error('Error editing quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ error: error.message });// If an error occurs, return a 500 Internal Server Error response
    };
});


//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id', checkJwtToken, async (req, res) => {
    const { id } = req.params;// Extract quiz ID from the request parameters
    
    try {
         // Conditional rendering if the provided quiz ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            // If the ID is invalid, respond with a 400 Bad Request status and an error message
            return res.status(400).json({
                message: 'Invalid quiz ID' // Error message indicating that the provided ID is not valid
            });
        }

        const deletedQuiz = await Quiz.findByIdAndDelete(id);// Find the quiz by its ID and delete it from the database
        
      // Conditional rendering to check if the quiz was not found (i.e., no quiz with the given ID exists)
        if (!deletedQuiz) {
            // If the quiz is not found, respond with a 404 Not Found status and an error message
            return res.status(404).json({
                message: 'Quiz not found' // Error message indicating that no quiz was found with the provided ID
            });
        }
        
       console.log(deletedQuiz);//Log the deleted quiz in the console for debugging purposes

        // Respond with a 200 OK status and a success message indicating that the quiz was successfully deleted
        res.status(200).json({ message: 'Quiz successfully deleted'});
    } 
 catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json(// If an error occurs, return a 500 Internal Server Error response
            { message: 'Internal Server Error'});
    }
});

// Export the router to be used in other parts of the application
module.exports = router; 
