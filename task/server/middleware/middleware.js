// Import necessary modules and packages
const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens
// Import schemas
const Quiz = require('../models/quizModel')// Import the Quiz model
// const User = require('../models/userSchema')// Import the User model
// const Score = require('../models/scoreSchema')//Import the score model

/*
// Function to verify a JWT token using a secret key
const verifyToken = (token, secret) => {
    // Return a new Promise for asynchronous processing
    return new Promise((resolve, reject) => {
        // Use the jwt.verify method to check the validity of the token
        jwt.verify(token, secret, (err, user) => {
            // If there is an error during verification, reject the promise
            if (err) reject(err);
            // If verification is successful, resolve the promise with the user information
            resolve(user);
        });
    });
};
*/

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];// Extract the Authorization header from the request
    const token = authHeader && authHeader.split(' ')[1];// Extract the token part after 'Bearer'
    if (token == null) return res.sendStatus(401);// If there's no token, respond with 401 (Unauthorised) response 

    // Verify the token using a secret key
    jwt.verify(token, 
         //SecretKey for signing the token
        /*process.env.JWT_SECRET,*/'secretKey',//secret key used for signing the token stored in enviromental variables
        (err, user) => {
            if (err) return res.sendStatus(403);// If token invalid, return a 403 (forbidden) response
            req.user = user;// Attach user info to request object
            // req.userId = decoded.userId;
            next();// Proceed to the next middleware or route handler
    });
};


//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization// Retrieve the authorization header from the request

    //Conditional rendering to check if the Authorization header is missing or does not start with 'Bearer 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });// Respond with a 401 (Unauthorised) status code
    }

    const token = authHeader.split(' ')[1];// Extract the authorization header

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(
            token,
            /*process.env.JWT_SECRET,*/'secretKey',//secret key used for signing the token stored in enviromental variables
        );
        req.user = decoded;// Attach decoded user information to the request object
        console.log('Token provided');//Log a message in the console for debugging purposes

        next();// Call the next middleware or route handler
    }
    catch (error) {
        //Error handling
        console.error('No token attatched to the request');//Log an error message in the console for debugging purposes
        res.status(400).json({ message: 'Invalid token.' });// Respond with a 400 (Bad Request) status
    }
}



//Middleware function to check that admin user is 18 years or older
const checkAge = (req, res, next) => {
    const { dateOfBirth } = req.body;// Extract the date of birth from the request body

    // Conditional rendering to check if the date of birth is provided in the request body
    if (!dateOfBirth) {
        console.error('Date of Birth is required');//Log an error message in the console for debugging purposes
        return res.status(400).json(// Respond with a 400 (Bad Request) status code if missing
            { error: 'Date of Birth is required' }
        );
    }
    // Calculate the user's age based on the date of birth
    const dob = new Date(dateOfBirth);// Convert the date of birth from string to Date object
    const age = Math.floor((Date.now() - dob) / 31557600000);// Calculate age in years

    // Conditional rendering to check if the calculated age is less than 18
    if (age < 18) {
        console.error('Admin Users must be older than 18 years old');//Log an error message in the console for debugging purposes
        return res.status(400).json({ error: 'Admin users must be above 18 years old' });// Respond with a 400 (Bad Request) status if underage
    }

    next();// Call the next middleware or route handler
};

//Middleware to authorise a user to edit a quiz
const editAuthorization = async (req, res, next) => {
    const quizId = req.params.quizId;// Get quiz ID from route parameters

    try {
        const quiz = await Quiz.findById(quizId)// Fetch the quiz from the database by ID

        //Conditional rendering check if the quiz exists
        if (!quiz) {
            // If quiz does not exist, return 404 (Not Found) status 
            return res.status(404).json({message: 'Quiz not found'})
        }

        //Conditional rendering to check if the creator of the quiz or an admin user
        if (quiz.username === req.user.username || req.user.admin) {
            next()// Authorized to edit, proceed to next middleware or route handler
        } else {
            res.status(403).json({ message: 'Unauthorised to edit this quiz' })// Respond with 401 (Forbidden) status code
        }
    } catch (error) {
        console.error('Error during authorization', error);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Internal server error' }) // Return a 500(Internal server error) status code
    }
}

//Middleware for user authorization to delete a quiz
const deleteAuthorization = async (req, res, next) => {
    const quizId = req.params.quizId;// Get quiz ID from route parameters

    try {
        const quiz = await Quiz.findById(quizId)// Fetch the quiz from the database by ID

        //Conditional rendering check if the quiz exists
        if (!quiz) {
            // If quiz does not exist, return 404 (Not Found) status 
            return res.status(404).json({ message: 'Quiz not found' })
        }

        //Conditional rendering to check if the creator of the quiz or an admin user
        if (quiz.username === req.user.username || req.user.admin) {
            // Allow deletion if user is the quiz creator or an admin
            next()// Proceed to next middleware or route handler if authorized
        } else {
            res.status(403).json({ message: 'Unauthorised to delete this quiz' })//Return a 403 (Unauthorised) status code and an error message
        }
    } catch (error) {
        console.error('Error during authorization', error);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Internal server error' })// Return a 500 (Internal server error) status code and error message in JSON response
    }
}

//Export middleware to be used in other parts of the application
module.exports = { authenticateToken, checkJwtToken, checkAge, editAuthorization, deleteAuthorization,/* verifyToken*/}
