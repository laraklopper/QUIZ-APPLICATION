// Import necessary modules and packages
const express = require('express');// Import Express to handle routing
const router = express.Router();// Create a new router object
const mongoose = require('mongoose');// Import Mongoose for MongoDB interaction
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT handling
//Schemas
const Quiz = require('../models/quizModel');// Import the Quiz model
const Score = require('../models/scoreSchema');//Import the Score model
//Custom middleware
const { checkJwtToken } = require('./middleware');//Import Custom middleware

//=======SETUP MIDDLEWARE===========
// Setup middleware
mongoose.set('strictPopulate', false); // Disable strict population checks in Mongoose

//=============================

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
       
        /*Conditional rendering to check if the quizId 
        is a valid MongoDB ObjectId*/
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            // Respond with a 400 Bad Request status and an error message
            return res.status(400).json({success: false,
                message: 'Invalid or missing quiz ID'
            });
        }
        // Find the quiz by its ID and populate the 'userId' field with the 'username'
        // Populate the 'userId' field with the associated 'username' from the User collection
        const quiz = await Quiz.findById(id)
            .populate('userId', 'username')// Populate the userId field with the username
            .exec()//Execute the query
        
        //Conditional rendering to check if the quiz is found
        if (!quiz) {
            // If the quiz is not found, respond with a 404 Not Found status and an error message
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz); // If the quiz is found, send it as the JSON response
        console.log(quiz);// Log the quiz in the console for debugging purposes
    }
    catch (error) {
        console.error('Error finding quiz:', error.message); // Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });// Respond with a 500 Internal Server Error status and the error message
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes',  async (req, res) => {
    try {  
        // Query the database for all quizzes
        // Populate the 'userId' field with the 'username' from the User collection
        const quizzes = await Quiz.find({}).
            populate('userId', 'username')// Populate the 'userId' field with 'username'
            .exec();  //Execute the query

            res.status(200).json({ success: true, quizList: quizzes});
        console.log(quizzes); // Log the quizzes for debugging purposes
    } 
    catch (error) 
    {//Error handling
        console.error('Error finding quizzes:', error.message);// Log an error message in the console for debugging purposes
        res.status(500).json(// Respond with a 500 Internal Server Error status and the error message
            { message: error.message });
    }
});


//------------POST--------------
//Route to add new quiz
router.post('/addQuiz',  async (req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purpose
    const { name, questions } = req.body;// Extract the quiz details from the request body

    // Conditional rendering to check that the quiz has a name and exactly 5 questions
    if (!name || !questions || questions.length !== 5) {
        return res.status(400).json({message: 'Quiz name and exactly 5 questions are required'});
    }

    try {           
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
        });

    // Save the new quiz to the database
        const savedQuiz = await newQuiz.save();
        
        res.status(201).json(savedQuiz);// Send the saved quiz as a response with a 201 Created status
        console.log(savedQuiz);;//Log the saved quiz in the console for debugging purposes
    } 
    catch (error) {
        console.error('Error occurred while adding new quiz:', error);//Log an error message in the console for debugging purposes
        res.status(500).json({ error: error.message });// Respond with a 500 Internal Server Error status and the error message
    }
})


//-------------------PUT--------------------------
// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken, async (req, res) => {   
    console.log(req.body);//Log the request body in the console for debugging purposes
  
    try {
        const { id } = req.params; // Extract quiz ID from the request parameters
        const { name, questions } = req.body;// Extract name and questions from the request body

        // Conditional rendering to check that the name and questions are properly provided
        if (!name || !Array.isArray(questions) || questions.length !== 5) {
            //Return a 400(Bad request) 
            return res.status(400).json(
                { success: false, message: 'Quiz name and exactly 5 questions are required' }
            )
        }
/*
        const updatedQuiz = {}
        if (name) updatedQuiz.name = name
        if (questions) updatedQuiz.questions =questions
  */
        if (!validateQuestions(questions)) {
            return res.status(400).json(
                {
                    success: 'false',
                    message: 'All fields are required'
                }
            )
        }

        //Find Quiz to ensure that the user is authorised to edit the quiz
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({success: false, message: 'Quiz not found'})
        }
        
        if (quiz.userId.toString() !== req.user.id) {
            return res.status(403).json({success: false, message: 'Unauthorised to edit this quiz'})
        }

        if (name.toUpperCase() !== quiz.name) {
            const nameExists = await Quiz.findOne({ name: name.toUpperCase() });
            if (nameExists) {
                return res.status(400).json({ 
                        success: false, 
                        message: 'Quiz name already exists' 
                    });
            }
        }
        // If the name is changing, update related scores
        if (name.toUpperCase() !== quiz.name) {
            await Score.updateMany({ name: quiz.name }, { $set: { name: name.toUpperCase() } });
        }

        // Update the quiz fields
        quiz.name = name.toUpperCase();
        quiz.questions = questions.map(q => ({
            questionText: q.questionText.toUpperCase(),
            correctAnswer: q.correctAnswer.trim(),
            options: q.options
        }));

        const editedQuiz = await Quiz.save()
        console.log(editedQuiz)//Log an error message in the console for debugging purposes


        // // Update the quiz
        // const editedQuiz = await Quiz.findByIdAndUpdate(
        //     id, // ID of the quiz to update
        //     {$set : updatedQuiz},
        //     { new: true, }// Return the updated document
        // );
       
        /*//conditional rendering to check if the quiz exists
        // if (!editedQuiz) {
            // If the quiz is not found, respond with a 404 Not Found status
            // return res.status(404).json({ message: 'Quiz not found' });
        // }
        */

        // Respond with the updated quiz
         res.status(200).json({ success: true, editedQuiz });
        // console.log(updatedQuiz);//Log the updated quiz in the console for debugging purposes      
           }   
    catch (error) {
        console.error('Error editing quiz:', error);//Log an error message in the console for debugging purposes
        // Return a 500 (Internal Server Error )error response with the error message
        return res.status(500).json({success: false, error: error.message });
    };
});


//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id', checkJwtToken,async (req, res) => {
    const { id } = req.params;// Extract quiz ID from the request parameters
    
    try {
        // Find the quiz by its ID and delete it from the database
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        
      //Conditional rendering to check if the quiz is found
        if (!deletedQuiz) {
            /* If the quiz is not found, respond with a 
            404 (Not Found) status and an error message*/
            return res.status(404).json({ message: 'Quiz not found' });
        }

        /* Delete all scores related to the deleted quiz
        Delete many removes all documents matching the specified criteria
        The Score model uses the name field to associate scores with quizzes*/
        await Score.deleteMany({name: deletedQuiz.name});

        console.log('Deleted Quiz:', deletedQuiz);// Log the deleted quiz in the console for debugging purposes
        res.status(200).json({ success: true, message: 'Quiz successfully deleted' });//Return a 200 OK status with a JSON object containing a success message
    } 
    catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, error: error.message });// Respond with a 500 (Internal Server Error) status
    }
});


// Export the router to be used in other parts of the application
module.exports = router; 
