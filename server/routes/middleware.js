// Import necessary modules and packages
const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens
// const User = require('../models/userSchema')//Import the user schema
require('dotenv').config()// Load environment variables from .env file

const secretKey = process.env.JWT_SECRET_KEY// Get the JWT secret key from the environment variables

//Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization// Retrieve the authorization header from the request

    const token = authHeader && authHeader.split(' ')[1];// Extract the authorization header
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })// Respond with a 401 (Unauthorised) status code
    
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(
            token,
            secretKey || 'secretKey',//Secret key used for signing the token stored in enviromental variables
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

//Middleware to ensure that the password has a minimum of eight characters
const checkPasswordLength = (req, res, next) => {
    const {password} = req.body;//Extract the password from the request body

    // Regular expression to check password requirements:
    // At least 8 characters and at least one special character
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    //Conditional rendering to test the password against the regular expression
    if (!passwordRegex.test(password)) {
        console.error('Invalid password length');//Log an error message in the console for debugging purposes
        // If the password fails the test, respond with a 400 (Bad Request) status and  an error message
        return res.status(400).json({ message: 'Password must be at least 8 characters long and contain one special character.' });
    }

    next();// Call the next middleware or route handler
}


//Export middleware to be used in other parts of the application
module.exports = {checkJwtToken, checkAge, checkPasswordLength}