// Import necessary modules and packages
const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens
// Import schemas
const Quiz = require('../models/quizModel')// Import the Quiz model
const User = require('../models/userSchema')//Import the User Schema

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


//Middleware function to check and verify a JWT token from the 'token' header
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

//Middleware function to check if the user is the quiz owner or admin
const checkQuizOwnerOrAdmin = async (req, res, next) => {
    const {id} = req.params
   
    try {
        const quiz = await Quiz.findById(id)
        const user = await User.findById(userId)

        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
       
        if (quiz.username === user.username || user.admin) {
            req.quiz = quiz;
            next();
        } else {
            res.status(403).json({ message: 'Unauthorized to modify this quiz' });
        }   
    } catch (error) {
        console.error('Authorization error:', error.message);
        res.status(500).json({ message: error.message });
    }
}

// module.exports = (resourceOwner) => {
//     return (req, res, next) => {
//         try {
//             // Allow action if user is admin or resource owner
//             if (req.user.role === 'admin' || req.user.username === resourceOwner) {
//                 return next();
//             }
//             return res.status(403).json({ message: 'Access denied. You do not have permission to perform this action.' });
//         } catch (error) {
//             res.status(500).json({ message: 'Authorization failed' });
//         }
//     };
// };


//Export middleware to be used in other parts of the application
module.exports = { authenticateToken, checkJwtToken, checkAge, isAdmin, checkQuizOwnerOrAdmin}
