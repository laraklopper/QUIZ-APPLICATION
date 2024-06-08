const Quiz = require('../models/quizSchema');

const createQuiz = async (req, res) => {
    console.log(req.body);
    try {
        const newQuiz = new Quiz(req.body);

        await newQuiz.save();
        res.status(201).json({message: 'Quiz successfully created'})

    } catch (error) {
        console.error('Error creating quiz');
        res.status(500).json({error: error.message})
    }
}

const getQuiz = async (req, res) => {
    console.log(req.body);

    try {
        const quizzes = await Quiz.find();
        res.json(quizzes)
        console.log(quizzes);
    } catch (error) {
        console.error('Error finding quizzes');
        res.status(500).json({ error: error.message })
    }
}
module.exports = { createQuiz, getQuiz}
