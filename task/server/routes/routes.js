const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const quizControllers = require('../controllers/quizControllers')
const userControllers = require('../controllers/userControllers')

//==============CUSTOM MIDDLEWARE======================
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        // console.log('Unauthorized: token missing');
        return res.status(401).json(
            { message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(
            token,
            'Secret-Key',
            /*process.env.JWT_SECRET*/
        );
        req.user = decoded;
        next();
    }
    catch (error) {
        //Error handling
        console.error('No token attatched to the request');
        res.status(400).json({ message: 'Invalid token.' });
    }
}

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token,
        'secretKey',
        (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
};

//Middleware function to check that admin user is 18 years or older
const checkAge = (req, res, next) => {
    const { dateOfBirth } = req.body;

    if (!dateOfBirth) {
        console.error('Date of Birth is required');
        return res.status(400).json(
            { error: 'Date of Birth is required' }
        );
    }

    const dob = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - dob) / 31557600000);

    if (age < 18) {
        console.error('Admin Users must be older than 18 years old');
        return res.status(400).json(
            { error: 'Admin users must be above 18 years old' }
        );
    }

    next();
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
//========QUIZ ROUTES=============
router.get('/quiz/findQuizzes', checkJwtToken, quizControllers.getQuizzes)
router.get('/quiz/:id', quizControllers.getQuiz)
router.post('addQuiz', quizControllers.addQuiz)
router.put('/quiz/editQuiz/:id', quizControllers.editQuizById)
router.delete('/quiz/deleteQuiz/:id', quizControllers.deleteQuiz)

//=======USER ROUTES======================
router.post('/users/login', userControllers.login)
router.post('/users/register', checkAge, userControllers.addUser)
router.get('/users/:id', authenticateToken, userControllers.findUser)
router.get('/users/findUsers', userControllers.findUsers)
router.put('/users/editAccount/:id', userControllers.editAccount)
router.delete('/user/deleteUser/:id', userControllers.deleteUser)

// Export the router to be used in other parts of the application
module.exports = router