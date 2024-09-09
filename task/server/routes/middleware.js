// Import necessary modules and packages
// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    // Extract the authorization header
    const authHeader = req.headers['authorization'];
    // Extract the token from the header
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    // Verify the token using a secret key
    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    // Retrieve the authorization header from the request
    const authHeader = req.headers.authorization 
   
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(
            { message: 'Access denied. No token provided.' });
    }
    // Extract the token from the authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, 'secretKey',);
        req.user = decoded;
        console.log('Token provided');

        next();// Call the next middleware or route handler
    }
    catch (error) {
        //Error handling
        console.error('No token attatched to the request');
        res.status(400).json({ message: 'Invalid token.' });
    }
}



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

//Export middleware to be used in other parts of the application
module.exports = { authenticateToken, checkJwtToken, checkAge }