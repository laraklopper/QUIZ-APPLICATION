// Import necessary modules and packages
// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];// Extract the authorization header
    const token = authHeader && authHeader.split(' ')[1];// Extract the token from the header

    // If no token is provided, return a 401 Unauthorized response
    if (token == null) return res.sendStatus(401);

    // Verify the token using a secret key
    jwt.verify(token,
        'secretKey',
        (err, user) => {// If verification fails, return a 403 Forbidden response
            if (err) return res.sendStatus(403);
            req.user = user;// Attach the user info from the token to the request object
            next();// Proceed to the next middleware or route handler
        });
};
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {

    const authHeader = req.headers.authorization // Retrieve the authorization header from the request
    /* Conditional rendering to check if the authorization header 
    is present and starts with 'Bearer '*/
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(// If not present or incorrect format, respond with 401 Unauthorized
            { message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];// Extract the token from the authorization header

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, 'secretKey',);
        // Attach the decoded token data to the request object for use in subsequent middleware/route handlers
        req.user = decoded;
        console.log('Token provided');// Log token validation status in the console for debugging purposes
        next();// Call the next middleware or route handler
    }
    catch (error) {
        //Error handling
        console.error('No token attatched to the request');//Log an error message in the console for debugging purposes
        res.status(400).json({ message: 'Invalid token.' });// If token verification fails, respond with 400 Bad Request
    }
}

//Middleware function to check that admin user is 18 years or older
const checkAge = (req, res, next) => {
    const { dateOfBirth } = req.body;// Extract the date of birth from the request body

    //Conditional rendering to check if the date of Birth is provided
    if (!dateOfBirth) {
        console.error('Date of Birth is required');//Log an error message in the console for debugging purposes
        return res.status(400).json(// If the date of birth is not provided, return a 400 Bad Request response
            { error: 'Date of Birth is required' }
        );
    }

    // Calculate the user's age based on the date of birth
    const dob = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - dob) / 31557600000); // Approximate age in years

    //Conditional rendering to check if the user is older than 18 
    if (age < 18) {
        console.error('Admin Users must be older than 18 years old');//Log an error message in the console for debugging purposes
        return res.status(400).json(// If the user is under 18, return a 400 Bad Request response
            { error: 'Admin users must be above 18 years old' }
        );
    }

    next();// If age is valid, proceed to the next middleware or route handler
};

module.exports = { authenticateToken, checkJwtToken, checkAge }
