// Import necessary modules and packages
const express = require('express');// Import Express Web framework 
const router = express.Router();// Create an Express router
/*
The express.Router() function is used to create a new router object. 
This function is used to create a new router object to handle requests. 
*/
const cors = require('cors'); //Import Cross-Origin Resource Sharing middleware
// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');
//Schemas
const Quiz = require('../models/quizSchema')// Import the quizSchema model
const User = require('../models/userSchema')// Import the quizSchema model

//=======SETUP MIDDLEWARE===========
router.use(express.json()); // Parse incoming request bodies in JSON format
/*Built-Middleware function used to parse incoming requests with JSON payloads.
Returns middleware that only parses JSON and only looks at requests where the
Content-Type header matches the type option.*/
router.use(cors()); //Enable Cross-Origin Resource sharing 

//==========CUSTOM MIDDLEWARE=====================
const authMiddleware = (req, res, next) => {
        // Retrieve the token from the Authorization header, if it exists, and remove the 'Bearer ' prefix
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        // If no token is found, respond with a 401 status code and an error message

        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(
            token, 
            'Secret-Key', //Secret-key
            /*process.env.JWT_SECRET*/);
                // Attach the decoded user information to the request object for further use in the request lifecycle
        req.user = decoded;
        next();// Call the next middleware function in the stack
    } catch (ex) {
                // If token verification fails, respond with a 400 status code and an error message
        res.status(400).json({ message: 'Invalid token.' });
    }
};
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
        const quiz = await Quiz.findById(req.params.id); // Attempt to find the quiz by its ID in the database 
            //Conditional rendering to check if a quiz is found
        if (!quiz) {
                // If no quiz is found, return a 404 Not Found response
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);// If quiz is found, return it as JSON response
    }
    catch (error) {
    // If an error occurs during database operation, return a 500 Internal Server Error response
        res.status(500).json(
            { message: error.message }
        );
    }
});

// Get all quizzes
router.get('/findquizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find({}); //find all quizzes in the database
        res.json(quizzes);
            /*Send a JSON response containing an array 
        of all quiz documents (quizzes) fetched from the database.*/
            // console.log(quizzes);
    } 
    catch (error) {
    /* If an error occurs during database operation, 
    return a 500 Internal Server Error response*/
        res.status(500).json(
            { message: error.message }
        );
    }
});


//------------POST--------------
// Save quiz results
/*router.post('/user/:id/result', async (req, res) => {
    try {
        const { quizId, score } = req.body;
        // Logic to save results in the database
        res.status(200).json({ message: 'Result saved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});*/

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
        const { id } = req.params; // Extract the quiz ID from the request parameters
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
        
        // Conditional rendering to check if updatedQuiz is null (quiz not found)
        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // If quiz is updated successfully, respond with updated quiz data
        res.status(200).json(updatedQuiz);
    } catch (error) {
        // If an error occurs during database operation or processing, log the error and return a 500 Internal Server Error response
        console.error('Error editing quiz:', error);//Log an error in the console for debugging purposes
        return res.status(500).json({ message: 'Internal Server Error' });//Send a 500 JSON response with an 'Internal Server Error' message.
    }
});

//--------DELETE---------------

// Route to delete a quiz by ID
router.delete('/deleteQuiz/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the quiz ID from the request parameters
        const removedQuiz = await Quiz.findByIdAndDelete(id); // Find and delete the quiz by its ID

        // Conditional rendering to check if removedQuiz is null (quiz not found)
        if (!removedQuiz) {
                //If the quiz is not found respond with a status 404 (Not Found) response
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // If quiz is successfully deleted, respond with success message
        res.status(200).json({ message: 'Quiz successfully deleted' });
    } catch (error) {
        // If an error occurs during database operation or processing, log the error and return a 500 Internal Server Error response
        console.error('Error deleting quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ message: 'Internal Server Error' });// Return a 500 Internal Server Error response
    }
});

module.exports =router; 
