const Score = require ('../models/scoreSchema');

//-----------GET-----------------------
//Controller function to all scores 
const findScores = async (req, res) => {
    try {
        const scores = await Score.find(req.body);

        if (!scores) {
            res.status(404).json('No scores found')
        }
        res.status(200).json(scores);
        console.log(scores);
        
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user scores', error });
        console.error({ message: 'Error fetching user scores', error });
    }
}

//Controller function to fetch scores for a specific user
const findScoreById = async (req, res) => {
    try {
        const{username} = req.params
        const score = await findOne({})
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user scores', error });
        console.error({ message: 'Error fetching user scores', error });
    }   
} 

module.exports = {findScores, findScoreById}