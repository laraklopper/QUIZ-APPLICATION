const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];// Extract token from Authorization header
    if (!token) return res.status(401).json(
        { message: 'No token provided' }
    );
    
    // Verify the token using the secret key
    jwt.verify( 
        token,  
       process.env.JWT_SECRET || 'secretKey', //SecretKey
        (err, user) => {
                //Conditional rendering to check if the token exists
        if (err) 
            return res.status(403).json(
                { message: 'Failed to authenticate token' }// If no token is provided, deny access
            );
        req.user = user;// Attach the decoded user information to the request object
        next();// Call next middleware
    });
};

//Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Unauthorized: token missing');
        return res.status(401).json({ message: 'Unauthorized: Token missing'})
    }

    try {
        const decoded = jwt.verify(
            token,
            'secretKey'
        )

        req.user = decoded

        console.log('Token verified');
        next()

    } 
    catch (error) {
        console.error('No token attatched to the request');
        return res.status(401).json({message: 'Forbidden: Invalid Token'})
    }
};

//Middleware function to check that admin user is 18 years or older
const checkAge = (req, res, next) => {
    const {dateOfBirth} = req.body;

    if (!dateOfBirth) {
        console.error('Date of Birth is required');
        return res.status(400).json({error: 'Date of Birth is required'})
    }
    const dob = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - dob / 31557600000));

    if (age < 18) {
        console.error('Admin Users must be older than 18 years old');
    }

    next()
}

// Middleware to check if the user is above 18 if admin is selected
const checkAdminAge = (req, res, next) => {
    if (req.body.admin) {
        const today = new Date();
        const birthDate = new Date(req.body.dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            return res.status(400).json({ error: 'Admin users must be above 18 years old' });
        }
    }
    next();
};

module.exports = {authenticateToken, checkJwtToken, checkAge}
