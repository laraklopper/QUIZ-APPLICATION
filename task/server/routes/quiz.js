// Import necessary modules and packages
const express = require('express');// Import Express to handle routing
const router = express.Router();// Create a new router object
const cors = require('cors');// Import CORS middleware to handle cross-origin requests
const mongoose = require('mongoose');// Import Mongoose for MongoDB interaction
//Schemas
const Quiz = require('../models/quizModel');// Import the Quiz model
// const Score = require('../models/scoreSchema');//Import the Score model
const {checkJwtToken} = require('./middleware');//Import Custom middleware

//=======SETUP MIDDLEWARE===========
// Setup middleware
mongoose.set('strictPopulate', false); // Disable strict population checks in Mongoose
//===================
//Utility function
const validateQuestions = (questions) => {
    return questions.every(q => q.questionText && q.options && q.correctAnswer);
}

//=============ROUTES====================
//------------------GET---------------
//Route to GET a specific quiz using the quiz Id
router.get('/findQuiz/:id', checkJwtToken, async (req, res) => {
    try {
        const { id } = req.params;// Retrieve the quiz ID from the request parameters

       
       //Conditional rendering to check if the quizId is a valid MongoDB ObjectId
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            // Respond with a 400 Bad Request status and an error message
            return res.status(400).json({success: false,
                message: 'Invalid or missing quiz ID'
            });
        }
        /*if (!mongoose.Types.ObjectId.isValid(id)) {
            // If not valid, respond with a 400 Bad Request status and an error message
            return res.status(400).json({
                success: false,
                message: 'Invalid quiz ID'
            });
        }*/
        
        // Find the quiz by its ID and populate the 'userId' field with the 'username'
        // Populate the 'userId' field with the associated 'username' from the User collection
        const quiz = await Quiz.findById(id)
        .populate('userId', 'username')// Populate the userId field with the username
        // .lean()//Return a plain JS object
        .exec()//Execute the query
        
        //Conditional rendering to check if the quiz is found
        if (!quiz) {
            // If the quiz is not found, respond with a 404 Not Found status and an error message
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz); // If the quiz is found, send it as the JSON response
        // res.json(quiz); // If the quiz is found, send it as the JSON response
        console.log(quiz);// Log the quiz in the console for debugging purposes
    }
    catch (error) {
        console.error('Error finding quiz:', error.message); // Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });// Respond with a 500 Internal Server Error status and the error message
    }
});
     


// Route to fetch all the quizzes from the database
router.get('/findQuizzes',   async (req, res) => {
    try {  
        // Query the database for all quizzes
        // Populate the 'userId' field with the 'username' from the User collection
        const quizzes = await Quiz.find({}).
            populate('userId', 'username') // Populate the 'userId' field with 'username'
            .exec(); //Execute the query
          res.status(200).json(
                { 
                    success: true, 
                    quizList: quizzes 
                });
        // res.json({ quizList: quizzes }) // Send the list of quizzes in the response as JSON
        console.log(quizzes);//Log the quizzes in the console for debugging purposes
    } 
    catch (error) 
    {//Error handling
        console.error('Error finding quizzes:', error.message);// Log an error message in the console for debugging purposes
        res.status(500).json(
            { message: error.message });// Respond with a 500 Internal Server Error status and the error message
    }
});

//------------POST--------------
//Route to add new quiz
router.post('/addQuiz',  async (req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purpose
    // Extract the quiz details from the request body
    const { name, questions /*,username */ } = req.body;

    // Conditional rendering to check that the quiz has a name and exactly 5 questions
    if (!name || !questions || questions.length !== 5) {
        return res.status(400).json({message: 'Quiz name and exactly 5 questions are required'});
        /*  A HTTP 400 (Bad Request) client error response status code indicates that 
            the server would not process the request due to something the server considered to be a client error */
    }

    try {           
        // Conditional rendering to check if a quiz with the same name already exists
        const existingQuiz = await Quiz.findOne({name});

        // Conditional rendering to check if a quiz with the same name already exists
        if (existingQuiz) {
             /*  A HTTP 400 (Bad Request) client error response status code indicates that 
            the server would not process the request due to something the server considered to be a client error */
            return res.status(400).json({message: 'Quiz name already exists'})
        }        
        
        // Create a new Quiz document with the provided details
        const newQuiz = new Quiz({
            name,         // The name of the quiz
            questions,    // Array of questions for the quiz
            // username
            // createdBy: req.user.userId
        });


        const savedQuiz = await newQuiz.save();// Save the new quiz to the database
        
        res.status(201).json(savedQuiz);// Send the saved quiz as a response with a 201 Created status
        console.log(savedQuiz);//Log the saved quiz in the console for debugging purposes
    } 
    catch (error) {
        console.error('Error occurred while adding new quiz:', error);//Log an error message in the console for debugging purposes
        res.status(500).json( // Respond with a 500 Internal Server Error status and the error message
            { error: error.message });
    }
})


//-------------------PUT--------------------------
// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken,  async (req, res) => {
   
     const { id } = req.params; // Extract quiz ID from the request parameters
    console.log(req.body);//Log the request body in the console for debugging purposes

    // Extract name and questions from the request body
    const { name, questions } = req.body;

  // Conditional rendering to check that the name and questions are properly provided
    if (!name || !Array.isArray(questions) || questions.length !== 5) {
        //Return a 400(Bad request) status code client response
        return res.status(400).json(
            {
                success: false,
                message: 'Quiz name and exactly 5 questions are required'
            }
        )}
    
    try {
       //Iterate over each question to validate its structure.
        for (const [index, question] of questions.entries()) {
            if (
                !question.questionText ||// Ensure 'questionText' is provided
                !question.correctAnswer ||// Ensure 'correctAnswer' is provided
                !Array.isArray(question.options) ||// Ensure 'options' is an array
                question.options.length !== 3// Ensure there are exactly 3 options
            ) {
                return res.status(400).json({//Return a 400(Bad request) 
                    success: false,
                    message: `Each question must have a question text, a correct answer, and exactly 3 options. 
                    Issue found in question ${index + 1}.`//Include the question index for debugging
                });
            }

    /*      for (const question of questions) {
        if (!question.questionText || !question.correctAnswer || question.options.length !== 3) {
            return res.status(400).json({
                message: 'Each question must have a question text, a correct answer, and exactly 3 options' 
            });
        }
    }*/
        // Update the quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id, // ID of the quiz to update
            //{$set: req.body}
            {$set: { name, questions }},// The updated quiz details 
            { new: true, }// Return the updated document
        );

        //conditional rendering to check if the quiz exists
        if (!updatedQuiz) {  
            // If the quiz is not found, respond with a 404 Not Found status
            return res.status(404).json({ message: 'Quiz not found' });
        }

       // res.json({ updatedQuiz });//Respond with the updated quiz in JSON format
        // Respond with the updated quiz
        res.status(200).json({
            success: true, // Indicate success
            updatedQuiz // Return the updated quiz
        });
        console.log(updatedQuiz);//Log the updated quiz in the console for debugging purposes      
    } 
    catch (error) {
        console.error('Error editing quiz:', error);//Log an error message in the console for debugging purposes
         return res.status(500).json({// Respond with a 500 Internal Server Error status and the error message
            success: false, // Indicate failure
            error: error.message // Return the error message
        });
    };
});

/*router.put('/:id', async (req, res) => {
    try {
        const updatedQuiz = await Quiz.updateOne(
            {_id: req.params.id},
            {$set: req.body}
        )
        res.status(200).json({ success: true, updatedQuiz })
        // console.log(updatedQuiz);
    } catch (error) {
        console.error('Error editing quiz:', error)
        return res.status(500).json({ success: false, error: error.message });
    }
})*/
//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id', checkJwtToken,async (req, res) => {
    const { id } = req.params;// Extract quiz ID from the request parameters
        console.log(`Attempting to delete quiz with ID: ${id}`);// Log the incoming request parameters for debugging purposes

    try {
        // Find the quiz by its ID and delete it from the database
                //If no quiz is found with the provided ID, `deletedQuiz` will be `null`
        const deletedQuiz = await Quiz.findByIdAndDelete(id);

        /*
        //Conditional rendering to check if the quiz is found
        if (!deletedQuiz) {
            // If the quiz is not found, respond with a 404 Not Found status
            return res.status(404).json({message: 'Quiz not found'});
        }*/

        //Conditional rendering to check if the quiz is found
        if (!deletedQuiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found'});
        };

         // Verify ownership before deletion
            /*if (deletedQuiz.userId.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to delete this quiz'
                });
            }*/
        
  /* Delete all scores related to the deleted quiz
        Delete many removes all documents matching the specified criteria
        The Score model uses the name field to associate scores with quizzes*/
        // await Score.deleteMany({name: deletedQuiz.name});

        console.log('Deleted Quiz:', deletedQuiz);// Log the deleted quiz in the console for debugging purposes
         /*res.status(200).json({
            success: true,
            message: 'Quiz successfully deleted'
        });*/
        res.json({ message: 'Quiz successfully deleted' })
    } 
    catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);//Log an error message in the console for debugging purposes
        // return res.status(500).json({ message: error.message });
        return res.status(500).json({// Respond with a 500 (Internal Server Error) status
            success: false, // Indicate failure
            message: error.message // Return the error message
        });
    }
});
//------------------CATCH-ALL ROUTE FOR UNDEFINED ENDPOINTS---------------
/*
router.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
*/

// Export the router to be used in other parts of the application
module.exports = router; 
