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
// const {checkJwtToken} = require('../middleware/middleware')//Import custom middleware

//=======SETUP MIDDLEWARE===========
router.use(express.json()); // Parse incoming request bodies in JSON format
/*Built-Middleware function used to parse incoming requests with JSON payloads.
Returns middleware that only parses JSON and only looks at requests where the
Content-Type header matches the type option.*/
router.use(cors()); //Enable Cross-Origin Resource sharing 

//==========CUSTOM MIDDLEWARE=====================
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(
            token, 
            'Secret-Key', 
            /*process.env.JWT_SECRET*/);
        req.user = decoded;
        next();
    } catch (ex) {
            console.error('No token attatched to the request');
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
//Route to GET a specific quiz using the quiz Id
router.get('/quiz/:id', checkJwtToken, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id); //Find the quiz by its ID from the request parameters
            //Conditional rendering to check if the quiz exists
        if (!quiz) {
                /*If no quiz is found with the given ID, return
                a 404 status code with a JSON response*/
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes', async (req, res) => {
    try {
        const {quizName} = req.query;// Extract quizName from query parameters
        const query = quizName ? {quizName} : {};//Constructs a MongoDB query object based on whether quizName is provided in the query parameters.
            //If quizName is provided, the query object filters quizzes by the quizName
        const quizzes = await Quiz.find(query);// Use Mongoose's find method to retrieve quizzes based on the query
        res.status(200).json(quizzes);// Respond with a 200 status code and the list of quizzes as JSON
    } 
    catch (error) {
       console.error('Error finding quizzes:', error.message); // Log error message in the console for debugging purposes
       res.status(500).json({ message: error.message });//Respond with a 500 status code (Internal Server Error) and the error message as JSON in the response body
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

//Route to add new quiz to the database
router.post('/addQuiz', async (req, res) => {
    const {quizName, questions} = req.body;// Extract the quizName and questions from request body
    const newQuiz = new Quiz({ quizName, questions });//Create a new instance of the quizModel

     //Debugging   
    console.log(req.body);//Log the request body in the console for debugging purposes
    console.log('Add Quiz');//Log a message in the console for debugging purposes
        
    try {            
        // Conditional rendering to check if quizName or questions are missing
        if (!quizName || ! questions) {
            return res.status(400).json({message: 'Quiz name and questions are required'})
        }       

        const savedQuiz = await newQuiz.save();// Save the new quiz to the database
            
        res.status(201).json(savedQuiz);// Respond with a 201 status code and the saved quiz object as JSON
        console.log(savedQuiz);//Log the new quiz in the console for debugging purposes
    } catch (error) {
        console.error(`Error occured while adding new quiz`);// Log error message in the console for debugging purposes
    // If an error occurs during the database operation, respond with a 400 status code and the error message
         res.status(400).json({ error: error.message });
            
    }
})
//---------PUT-----------
// Route to edit a quiz
router.put('/editQuiz/:id', async (req, res) => {
     const { id } = req.params; // Extracts quiz ID from request parameters
    const { quizName, questions } = req.body; // Extract the quizName and questions from request body
    try {
    // Update the quiz in the database using findByIdAndUpdate method
        const updatedQuiz = await Quiz.findByIdAndUpdate(
                id, //Quiz Id
                req.body, //
                { new: true }// Returns the updated document
        );
        //Conditional rendering to check if the updated quiz exists
        if (!updatedQuiz) {
                / If no quiz is found with the given ID, return a 404 status and a "Quiz not found" message
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(updatedQuiz);//Return the updated quiz object as a JSON response
    } 
    catch (error) {
        console.error('Error editing quiz:', error);// Log error message in the console for debugging purposes
        return res.status(400).json({ error: error.message });        // Return a 400 status code and the error message as JSON response
    }
});

//--------DELETE---------------

// Route to delete a quiz by ID
router.delete('/deleteQuiz/:id', checkJwtToken, async (req, res) => {
            const {id} =req.params;// Extract the quiz ID from the request parameters

    try {
        const quiz = await Quiz.findByIdAndDelete(id); // Find and delete the quiz by its ID
            
        //Conditional rendering to check if the quiz with the given ID exists
        if (!quiz) {
        // If no quiz is found with the given ID, return a 404 status and a "Quiz not found" message
            return res.status(404).json({message: 'Quiz not found'})
        }
       

        // If quiz is successfully deleted, respond with success message
        res.status(200).json({ message: 'Quiz successfully deleted' });
    } catch (error) {
        // If an error occurs during database operation or processing, log the error and return a 500 Internal Server Error response
        console.error('Error deleting quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ message: 'Internal Server Error' });// Return a 500 Internal Server Error response
    }
});

module.exports =router; // Export the router to be used in other parts of the application
