const express = require('express');
const router = express.Router();
const cors = require('cors');
// const jwt = require("jsonwebtoken");
const Score = require('../models/scoreSchema')
const mongoose = require('mongoose');

//=======SETUP MIDDLEWARE===========

router.use(cors())
router.use(express.json())
mongoose.set('strictPopulate', false)

//========Routes===========
//--------POST----------
// Route to add new score
router.post('/addScore', async(req, res) => {
    console.log(req.body);

    try {
        const { username, quizName, score } = req.body;
        
        const newScore = ({ username, quizName, score });
        const existingScore = await Score.findOne(
            { username, quizName });

        if (existingScore) {
            existingScore.score = score
            const updatedScore = await existingScore.save();
            return res.status(200).json(updatedScore);
        } else {
            const createdScore = new Score(newScore);
            const savedScore = await createdScore.save();
            return res.status(201).json(savedScore);
        }
    } 
    catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: error.message });
    }
    
})

//Route to fetch scores for a single user 
router.get('/findScores/:id', async(req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID'
            });
        }
        const result = await Score.find({ user: req.body.userId })
            .populate("quiz")
            .populate("username")
            .sort({ createdAt: -1 });
            res.json({userScores: result})
    } catch (error) {
        console.error('Error finding user scores');
        return res.status(500).json({ error: error.message });        
    }
})

module.exports = router; 