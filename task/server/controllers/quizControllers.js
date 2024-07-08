const Quiz = require('../models/quizSchema');

//============================================
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

//==========POST=============================
//Function to add a new quiz
const createQuiz = async (req, res) => {
    console.log(req.body);
    try {
        const {quizName, questions} = req.body
        const newQuiz = new Quiz({quizName, questions});

        const createdQuiz = await newQuiz.save();
        
        res.status(201).json({message: 'Quiz successfully created'})

    } 
    catch (error) {
        console.error('Error creating quiz:',error);
        res.status(500).json({error: 'Error creating quiz'})
    }
}
//=============GET=====================
//Function to get a single quiz
const getQuiz = async (req, res) => {

    try {
        const quiz = await Quiz.findOne();
        res.json(quizzes)
        console.log(quizzes);
    } catch (error) {
        console.error('Error finding quizzes');
        res.status(500).json({ error: error.message })
    }
}

//Function to fetch all quizzes
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Error fetching quizzes' });
  }
};

//============PUT==================
//Function to edit a quiz
exports.editQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { quizName, questions } = req.body;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { quizName, questions },
      { new: true }
    );
    if (!updatedQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Error updating quiz' });
  }
};

//====================DELETE============================
//Function to delete a quiz by Id
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Error deleting quiz' });
  }
};

module.exports = { createQuiz, getQuiz, getQuizzes, editQuiz,deleteQuiz}
