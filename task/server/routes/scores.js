// Import necessary modules and packages
const express = require('express');
const router = express.Router();
const cors = require('cors');
// const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
//Schemas
const Score = require('../models/scoreSchema');
// const bodyParser = require('body-parser');

//=======SETUP MIDDLEWARE===========
router.use(cors())
router.use(express.json())
router.use(express.urlencoded({extended: true}))
mongoose.set('strictPopulate', false)

//========Routes===========
//--------POST----------
// Route to add new score
router.post('/addScore', async(req, res) => {
    console.log(req.body)// Log request body for debugging purposes


    try {
        //Extract the username, name(quizName), and score from the request body
        const { username, name, score } = req.body;
       // Conditional rendering to check if username, name, and score are provided
               if (!username || !name || !score) {
            return res.status(400).json(
                { error: 'Username, name, and score are required.' });
        }

        /* Conditional rendering to check if a score entry for the 
        given username and quiz name already exists*/
        const existingScore = await Score.findOne({ username, name });

        if (existingScore) {                
            // If the score already exists, update it if the new score is higher
            if (score > existingScore.score) {
                existingScore.score = score;
                // Save the updated score
                const updatedScore = await existingScore.save();
                // Populate user and quiz name fields for the response
                await updatedScore.populate('username name').execPopulate();
                return res.status(200).json(updatedScore);
            } else {
                // If the new score is not higher, return the existing score
                await existingScore.populate('username name')
                    .execPopulate()
              return res.status(200).json(existingScore);  
            }
        }        
        else  {
            // If no existing score entry is found, create a new score entry
            const newScore = new Score({ username, name, score });
            const savedScore = await newScore.save();
            // Populate user and quiz name fields for the response
            await savedScore.populate('username name')
                .execPopulate();
            return res.status(201).json(savedScore);
        }
    } 
    catch (error) {
        console.error('Error saving score:', error);
        return res.status(500).json({ error: error.message });
    }    
})

//-----------GET-------------------------
//Route to fetch scores for a single user 
router.get('/findScores/:username', async(req, res) => {
    try {
        const username = req.params.username
        
        const result = await Score.find({ username})
            .populate('name')
            .populate('username')
            .sort({ createdAt: -1 });
            res.json({userScores: result})
    } catch (error) {
        console.error('Error finding user scores');
        return res.status(500).json({ error: error.message });        
    }
})
//Route to GET all scores
router.get('/allScores', async (req, res) => {
    try {
        const allScores = await Score.find()
            .populate("name")
            .sort({ createdAt: -1 });

        res.json({ allScores });
    } catch (error) {
        console.error('Error fetching all scores:', error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router; 
