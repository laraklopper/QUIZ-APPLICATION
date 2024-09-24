// Import necessary modules and packages
const express = require('express');
const router = express.Router(); 
const cors = require('cors');
const mongoose = require('mongoose');
// Import schemas
const Score = require('../models/scoreSchema');
const User = require('../models/userSchema');
const Quiz = require('../models/quizModel');

//=======SETUP MIDDLEWARE===========
// Setup middleware
router.use(cors()); 
router.use(express.json()); 
mongoose.set('strictPopulate', false); 

//=============ROUTES=====================
//----------GET------------------
router.get('/findScores/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const result = await Score.find({ userId: (await User.findOne({ username }))._id })
            .populate('quizId')
            .populate('userId')
            .sort({ createdAt: -1 });

        res.json({ userScores: result });

    } catch (error) {
        console.error('Error finding user scores:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Route to fetch all scores
router.get('/allScores', async (req, res) => {
    try {
        const allScores = await Score.find()
            .populate('quizId')
            .populate('userId')
            .sort({ createdAt: -1 });

        res.json({ allScores });
    } catch (error) {
        console.error('Error fetching all scores:', error);
        return res.status(500).json({ error: error.message });
    }
});

//-----------POST----------------------
//Route to add a new score
router.post('/addScore', async (req, res) => {
    console.log(req.body);

    try {
        const { username, name, score, attempts } = req.body;

        if (!username || !name || score === undefined || isNaN(score)) {
            return res.status(400).json({
                error: 'Username, quiz name, and a valid score are required.',
            });
        }

        const user = await User.findOne({ username }).exec();
        if (!user) {
            throw new Error('User not found');
        }

        const quiz = await Quiz.findOne({ name }).exec();
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        const existingScore = await Score.findOne({ userId: user._id, quizId: quiz._id }).exec();

        if (existingScore) {
            if (score > existingScore.score) {
                existingScore.score = score;
                existingScore.attempts += 1;
                const updatedScore = await existingScore.save();
                await updatedScore.populate('userId quizId').execPopulate();
                return res.status(200).json(updatedScore);
            } else {
                await existingScore.populate('userId quizId').execPopulate();
                return res.status(200).json(existingScore);
            }
        } else {
            const newScore = new Score({
                userId: user._id,
                quizId: quiz._id,
                score: Math.floor(score),
                attempts: attempts || 1
            });
            const savedScore = await newScore.save();
            await savedScore.populate('userId quizId').execPopulate();
            return res.status(201).json(savedScore);
        }
    } catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Export the router to be used in other parts of the application
module.exports = router;
