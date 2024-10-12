// Import necessary modules and packages
// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];// Extract the authorization header
    const token = authHeader && authHeader.split(' ')[1];// Extract the token from the header
    if (token == null) return res.sendStatus(401);// If no token, return unauthorized

 // Verify the token using a secret key
    jwt.verify(token, 
        'secretKey', //SecretKey for signing the token
        /*process.env.JWT_SECRET,*///secret key used for signing the token stored in enviromental variables
        (err, user) => {
            if (err) return res.sendStatus(403);// If token invalid, return forbidden
            req.user = user;// Attach user info to request object
            // req.userId = decoded.userId;
            next();// Proceed to the next middleware or route handler
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
        const decoded = jwt.verify(
            token,
            /*Secret key used for signing the token
            stored in enviromental variables*/
            'secretKey'
            /*process.env.JWT_SECRET*/
        );
        req.user = decoded;// Attach decoded user information to the request object
        console.log('Token provided');//Log a message in the console for debugging purposes

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


/*
//Middleware to check if the user is Admin
const adminUser = async (req, res, next) => {
    try {
        const {admin} = req.body(admin)// Extract admin status from the request body

        if (!admin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' }); // Deny access if not admin
        }

        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error('Error checking admin status', error.message);
        res.status(500).json({message : 'Internal Server Error'})       
    }
}*/

// Middleware to add the username to the quiz
/*const currentUser = async (req, res, next) => {
    try {
        const user = await User.findUserId(req.user.userId).select('Username');// Find user by ID and select username

        if (!username) {
            return res.status(404).json({ message: 'Username not found' }); // Respond if username not found
        }
        req.user.username = user.username; // Attach username to the request object
        next(); // Proceed to the next middleware
    } catch (error) {
        console.error('Username not found:', error.message); // Log error if encountered
        res.status(500).json({ message: 'Internal server error.' }); // Respond with server error
    }
}*/

//Middleware function to check if a score exists for the current user
/*const checkUserScores = async (req, res, next) => {
    try {
        const { username, quizName } = req.params;// Extract username and quiz name from params
        const scoreExists = await Score.findOne({ username, name: quizName }) // Check if score exists
            .exec()

            //Conditional rendering to check if the score exists
        if (scoreExists) {
            req.existingScore = scoreExists;// Attach existing score to request object
            next()// Call the next middleware or route handler
        } else {
            res.status(404).json({ message: 'No score found for this user and quiz' })
        }
    } catch (error) {
        console.error('Error checking user score:', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Error checking user score.' }); // Respond with a server error
    }
}*/


//Export middleware to be used in other parts of the application
module.exports = { authenticateToken, checkJwtToken, checkAge,/* adminUser, ,checkUserScores*/}
