// Import necessary modules and packages
const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens
// Import schemas
const Quiz = require('../models/quizModel')// Import the Quiz model
const User = require('../models/userSchema')//Import the User Schema

// Middleware to verify JWT and extract user info
/*const authenticateToken = (req, res, next) => {
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
};*/


//Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization// Retrieve the authorization header from the request
     const token = authHeader && authHeader.split(' ')[1];// Extract the authorization header
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })// Respond with a 401 (Unauthorised) status code

    // //Conditional rendering to check if the Authorization header is missing or does not start with 'Bearer 
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res.status(401).json({ message: 'Access denied. No token provided.' });// Respond with a 401 (Unauthorised) status code
    // }

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
}//Middleware function to check that admin user is 18 years or older
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
    // const ageDiffMs = Date.now() - dob.getTime(); // Difference in milliseconds
    // const ageDate = new Date(ageDiffMs); // Convert to a date object for easier calculation
    // const age = Math.abs(ageDate.getUTCFullYear() - 1970); // Calculate age by subtracting the epoch year
    const age = Math.floor((Date.now() - dob) / 31557600000);// Calculate age in years

    // Conditional rendering to check if the calculated age is less than 18
    if (age < 18) {
        console.error('Admin Users must be older than 18 years old');//Log an error message in the console for debugging purposes
        return res.status(400).json({ error: 'Admin users must be above 18 years old' });// Respond with a 400 (Bad Request) status if underage
    }

    next();// Call the next middleware or route handler
};
/*
//Middleware function to check if the user is an admin user
const isAdmin = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId)

        if (!user) return res.status(404).json({ success: false, message: 'User not found' })
        if (user.admin) {
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized access. Admins only.' });
        }
    } catch (error) {
        console.error('Authorization error:', error.message);
        res.status(500).json({ message: error.message });
    }
}
*/
//Middleware to check if the user has authorisation to modify or delete a quiz
const quizAuthorization = async (req, res, next) => {
    try {
        const {id} = req.params; //Retrieve quizId from query params

        const quiz = await Quiz.findById(id);//Find the quiz by ID

        //Conditional rendering to check if the quiz is not found
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' })// Respond with 404 (Not Found)if quiz is not found
        }
    

        const user = await User.findById(req.user.id);// Retrieve user from the token payload

        if (!user) {
            return res.status(404).json({ message: 'User not found' })// Respond with 404 if user is not found
        }

        // Conditional rendering to check if the user is authorized to modify the quiz 
        if (quiz.userId.toString() !== user._id.toString() && !user.isAdmin) {
            return res.status(401).json(//Respond with a 401 (Unauthorised) response
                { message: 'Access denied. You do not have permission to modify this quiz.' });
        }
        next()// Call the next middleware or route handler
    } catch (error) {
        console.error('Authorization error:', error.message); // Log the error for debugging purposes
        res.status(500).json({ message: 'Server error while authorizing user.' });// Respond with a 500 status on server error
    }
}
//Export middleware to be used in other parts of the application
module.exports = {checkJwtToken, checkAge, quizAuthorization}
