// Import necessary modules and packages
const Quiz = require('../models/quizModel');
const mongoose = require('mongoose');

//=============SETUP MIDDLEWARE==================
mongoose.set('strictPopulate', false);

//=============CRUD OPERATIONS==================
/*
|============================|
| CRUD OPERATION | HTTP VERB |
|================|===========|
|CREATE          | POST      | 
|----------------|-----------|
|READ            | GET       |  
|----------------|-----------|     
|UPDATE          | PUT       |
|----------------|-----------|
|DELETE          | DELETE    |
|================|===========|
*/
//-----------POST---------------------
//Controller function to create a new quiz
const addQuiz = async (req, res) => {
    console.log(req.body);
    try {
        const {name, questions} = req.body

        if (!name || !questions) {
            return res.status(400).json(
                { message: 'Quiz name and questions are required' });
        }

        const newQuiz = new Quiz({name, questions});
        const savedQuiz = await newQuiz.save()

        res.status(201).json(
            { message: 'Quiz successfully created', quiz: savedQuiz })
        console.log(savedQuiz);

    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Error creating quiz' })
    }
}

//-----------GET-----------------------

    //Controller function to get a single quiz
const getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('username', 'username');
        
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.json(quiz)
        console.log(quiz);
    } 
    catch (error) {
        console.error('Error finding quiz:', error);
        res.status(500).json({ error: 'Error finding quiz' });
    }
}

//Controller function to fetch all quizzes
const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({});
        res.status(200).json(quizzes);
        console.log(quizzes)
    }
    catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Error fetching quizzes' });
    }
};

//============PUT==================
//Controller function to edit a quiz
const editQuizById = async (req, res) => {
    const {_id} = req.params;
    try {
        const editedQuiz = await Quiz.findByIdAndUpdate(
            _id,
            {$set: req.body},
            {new: true}
        );

        if (!editedQuiz) {
            return res.status(404).json('Quiz not found')
        }
        res.json(editedQuiz)
        console.log(editedQuiz);

    } 
    catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ error: 'Error updating quiz' });
    }
};

//====================DELETE============================
//Controller function to delete a quiz by Id
const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ error: 'Error deleting quiz' });
    }
};
//-----------------EXPORT FUNCTIONS----------------

module.exports = { 
    addQuiz, 
    getQuiz, 
    getQuizzes, 
    editQuizById, 
    deleteQuiz 
};
