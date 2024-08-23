const jwt = require('jsonwebtoken');

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

//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(
            token,
            'Secret-Key',
            /*process.env.JWT_SECRET*/
        );
        req.user = decoded;
        next();
    } catch (ex) {
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


module.exports = {authenticateToken, checkJwtToken, checkAge}