const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];// Extract token from Authorization header

    //Conditional rendering to check if the token is provided
    if (!token) return res.status(401).json(
        { message: 'No token provided' }// Respond with 401 if no token is provided
    );
    
    // Verify the token using the secret key
    jwt.verify( 
        token,  
       process.env.JWT_SECRET || 'secretKey',  // Use the secret key from environment variables or a default key
        (err, user) => {
                //Conditional rendering to check if the token exists
        if (err) 
            return res.status(403).json(
                { message: 'Failed to authenticate token' }// Respond with 403 if token verification fails
            );
        req.user = user;// Attach the decoded user information to the request object
        next();// Call next middleware
    });
};

//Middleware for password validation
const passwordValidation = (req, res, next) => {
    const { password } = req.body; // Extract the password from the request body

    // Regular expression to validate password requirements
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    /*
    This regex ensures that the password meets the following criteria:
    - At least one uppercase letter: (?=.*[A-Z])
    - At least one lowercase letter: (?=.*[a-z])
    - At least one digit: (?=.*\d)
    - At least one special character from the set @$!%*?&: (?=.*[@$!%*?&])
    - Minimum length of 8 characters: [A-Za-z\d@$!%*?&]{8,}
    */

    if (!passwordRegex.test(password)) {
        return res.status(400).json({// Respond with 400 if the password does not meet the requirements
            message: 
                "Password must be at least 8 characters long, contain at least one 
                uppercase letter, one lowercase letter, one number, and one special character."
        }); 
    }

    next(); // Call the next middleware function
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

module.exports = {authenticateToken, checkJwtToken, checkAge, passwordValidation}

