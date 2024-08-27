// Import necessary modules and packages
const express = require('express');// Import Express Web framework
const router = express.Router();// Create an Express router
// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');
const cors = require('cors');//Import Cross-Origin Resource Sharing middleware
//Schemas
const User = require ('../models/userSchema');// Import the User model
//Import custom middleware
// const {authenticateToken, checkAge} = require('./middleware');

//=======SETUP MIDDLEWARE===========
router.use(cors());//Enable Cross-Origin Resource sharing 
router.use(express.json());// Parse incoming request bodies in JSON format

//=========CUSTOM MIDDLEWARE==================

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

//=============ROUTES=====================
//------------------GET---------------
//Route to handle GET requests to fetch a single user
router.get('/userId',authenticateToken, async (req, res) => {
    // console.log('Finding User');
    try {
       /* Retrieve the user ID from the authenticated token 
        and fetch the user excluding the password field*/
        const user = await User.findById(req.user.userId).select('-password');
        
       // Conditional rendering to check if the user is found
         if (!user) {
             console.error('User not found');//Log an error message in the console for debugging purposes
            return res.status(400).json({ message: 'User Not Found'})
         }
         res.status(200).json(user); // Return the users in the response
        console.log('User details', user);//Log an error message in the console for debugging purposes
         
    } 
    catch (error) {
         console.error('Error fetching Users', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json(// If an error occurs, return a 500 Internal Server Error response
            {message: 'Internal Server Error', error: error.message}
        )
    }
})


//Route to GET all users
router.get('/findUsers', async (req, res) => {
    // console.log('Finding Users');//Log a message in the console for debugging purposes

    try {
        const { username } = req.query;// Extract the username from the query parameters
        const query = username ? { username } : {};// Fetch users matching the query
        const users = await User.find(query);// Fetch users matching the query
    
        console.log(users);//Log the users in the console for debugging purposes
        res.status(200).json(users);// Return the users in the response
    } 
    catch (error) {
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json(// If an error occurs, return a 500 Internal Server Error response
            { message: 'Internal server Error' }
        );
    }
})

//-------------POST-------------------
//Route to send POST request to login endpoint
router.post('/login', async (req, res) => {
    console.log(req.body);
    console.log('User Login')

    try {
        
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        console.log(user);

        if (!user) {
            throw new Error('User not found')
        }

        if (/*username === user.username &&*/password === user.password) {
            // Generate a JWT token for authentication
            const jwtToken = jwt.sign(
                { userId: user._id },
                        'secretKey',
                        /*process.env.JWT_SECRET,*/
                        {
                            expiresIn: '12h',
                            algorithm: 'HS256',
                        }
                    );
            // Send the generated JWT token as a JSON response
            res.json({ 'token': jwtToken })
        } 
        else {
            throw new Error('Password Incorrect');
        }
     
    } catch (error) {
        console.error('Login Failed: Username or password are incorrect');
        res.status(401).json({ message: 'User not authenticated' })
    }
})

//Route to send a POST request the register endpoint
router.post('/register', checkAge, async (req, res) => {
    console.log(req.body);
    try {
        const {username, email, dateOfBirth, password, admin = false } = req.body;
      
        if (!username || !email || !dateOfBirth || !password) {
          console.error('Username and password are required');
          return res.status(400).json(
            { message: 'Username and password are required' }
        );
        }
      
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json(
                { message: 'Username already exists' }
            );
        };


        const newUser = new User({
            username,
            email,
            dateOfBirth,
            admin,
            password 
        });

        const savedUser = await newUser.save();

        const token = jwt.sign(
            { _id: savedUser._id },
            'secretKey',
            /*process.env.JWT_SECRET,*/
            {
                expiresIn: '12h',
                algorithm: 'HS256'
            }
        );

        res.status(201).json({ token, user: savedUser });
        console.log(savedUser);

    } 
    catch (error) {
        console.error('Failed to add User');
        return res.status(500).json(
            { error: 'Internal Server Error' }
        )
    }
})


//-------------PUT-----------------
//Route to edit a user account
router.put('/editAccount/:id', async (req, res) => {
    console.log('edit Account');
    try {
        const {id} = req.params
        const {username, email} = req.body

        const updateUser = {}
        if (username) updateUser.username = username
        if (email) updateUser.email = email;

        const updatedAccount = await User.findByIdAndUpdate(
            id,
            updateUser,
            { new: true }
        )

        if (!updatedAccount) {
            return res.status(404).json({ message: 'User not found' })
        }
        console.log('Updated User Account:', updatedAccount);
        res.status(201).json(
            { message: 'User account successfully updated', updatedAccount }
        );
    } 
    catch (error) {
        console.error(`Error occured while updating User Account ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' })

    }
})


//---------------DELETE--------------------
//Route to send a DELETE request to the /deleteUser endpoint
router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const removedUser = await User.findByIdAndDelete(id);
        if (!removedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.json({
            message: 'User Successfully deleted',
            deletedUserId: removedUser._id
        })

    } 
    catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: 'Failed to delete User' });
    }
})



// Export the router to be used in other parts of the application
module.exports = router;
