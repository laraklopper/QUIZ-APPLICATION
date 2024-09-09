// Import necessary modules and packages
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cors = require('cors');
//Schemas
const User = require('../models/userSchema');
//Import custom middleware
// const {authenticateToken, checkAge} = require('./middleware');

//=======SETUP MIDDLEWARE===========
router.use(cors()); // Enable Cross-Origin Resource Sharing
router.use(express.json()); // Parse incoming JSON requests

//=========CUSTOM MIDDLEWARE==================

// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    // Extract the authorization header
    const authHeader = req.headers['authorization'];
    // Extract the token from the header
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);// If no token, return unauthorized

    // Verify the token using a secret key
    jwt.verify(token,
        'secretKey',//SecretKey
        (err, user) => {
            if (err) return res.sendStatus(403);// If token invalid, return forbidden
            req.user = user;// Attach user info to request object
            next();// Proceed to the next middleware or route handler
        });
};

//Middleware function to check that admin user is 18 years or older
const checkAge = (req, res, next) => {
    // Extract the date of birth from the request body
    const { dateOfBirth } = req.body;

    if (!dateOfBirth) {
        console.error('Date of Birth is required');
        return res.status(400).json(
            { error: 'Date of Birth is required' }
        );
    }

    // Calculate the user's age based on the date of birth
    const dob = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - dob) / 31557600000); 

    if (age < 18) {
        console.error('Admin Users must be older than 18 years old');
        return res.status(400).json(
            { error: 'Admin users must be above 18 years old' }
        );
    }
    // If age is valid, proceed to the next middleware or route handle
    next();
};

//=============ROUTES=====================
/*
|================================================|
| CRUD OPERATION | HTTP VERB | EXPRESS METHOD    |
|================|===========|===================|
|CREATE          | POST      |  router.post()    |
|----------------|-----------|-------------------|
|READ            | GET       |  router.get()     |  
|----------------|-----------|-------------------|     
|UPDATE          | PUT       |  router.put()     |
|----------------|-----------|-------------------|
|DELETE          | DELETE    |  router.delete()  |
|================|===========|===================|
*/
//------------------GET---------------
//Route to handle GET requests to fetch a single user
router.get('/userId',authenticateToken, async (req, res) => {
    // console.log('Finding User');
    try {
        /* Retrieve the user ID from the authenticated token 
        and fetch the user excluding the password field*/
        const user = await User.findById(req.user.userId).select('-password');
        
        //Conditional rendering to check if the user exists
         if (!user) {
             console.error('User not found');//Log an error message in the console for debugging purposes
             return res.status(400).json(// If no user is found, log an error and send a 400 response
                { message: 'User Not Found'}
            )
         }

        res.status(200).json(user); // Return the users in the response
        console.log('User details', user);//Log the user details in the console for debugging purposes
         
    } 
    catch (error) {
        console.error('Error fetching Users', error.message);//Log an error message in the console for debugging purpose
        res.status(500).json(//send a 500 response if something goes wrong
            {message: 'Internal Server Error', error: error.message}
        )
    }
})


//Route to GET all users
router.get('/findUsers', async (req, res) => {
    // console.log('Finding Users');//Log a message in the console for debugging purposes
    try {
        
        const { username } = req.query;// Extract the username from the query parameters
        // If a username is provided, use it to filter users, otherwise return all users
        const query = username ? { username } : {};
        const users = await User.find(query); // Fetch users based on the query object
    
        console.log(users);// Log the fetched users for debugging purposes
        res.status(200).json(users);// Send the list of users as the response
    } 
    catch (error) {
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purpose
        res.status(500).json(//send a 500 response if something goes wrong
            { message: 'Internal server Error' }
        );
    }
})


//-------------POST-------------------
//Route to send POST request to login endpoint
router.post('/login', async (req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purposes
    // console.log('User Login')//Log a message in the console for debugging purposes

    try {
        // Extract username and password from the request body
        const { username, password } = req.body;
        // Find the user in the database by username and password
        const user = await User.findOne({ username, password });
        console.log(user); //Log the user in console for debugging purposes
        
        //Conditional rendering to check if the user exists
        if (!user) {
            throw new Error('User not found');//Throw an error message if no user is found
        }
      
        if (username === user.username && password === user.password) {
            // Generate a JWT token for authentication
            const jwtToken = jwt.sign(
                { userId: user._id },// Payload containing user ID
                     'secretKey',// Secret key for token signing
                        /*process.env.JWT_SECRET,*/
                        {
                            expiresIn: '12h',// Token expiration time
                            algorithm: 'HS256',// Signing algorithm
                        }
                    );
            // Send the generated JWT token as a JSON response
            res.json({ 'token': jwtToken })//Send the generated token back to the client
        } 
        else {
            //Throw an error message if the user credentials are incorrect
            throw new Error('Password Incorrect');
        }
     
    } catch (error) {
        console.error('Login Failed: Username or password are incorrect');//Log an error message in the console for debugging purposes
        res.status(401).json(//Send a 401 status error message to the client indicating an authentication failure
            { message: 'User not authenticated' })
    }
})

//Route to send a POST request the register endpoint
router.post('/register', checkAge, async (req, res) => {
    // console.log(req.body);//Log the request body in the console for debugging purposes
    try {
        // Extract user details from the request body, with 'admin' defaulting to false
        const { username, email, dateOfBirth, password, admin = false } = req.body;
        
      
        if (!username || !email || !dateOfBirth || !password) {
            console.error('Username and password are required');
            return res.status(400).json(
                { message: 'Username, email, date of birth, and password are required' });
        }
      
        // Conditional rendering to check if a user with the same username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json(
                { message: 'Username already exists' }
            );
        };

        // Create a new user instance with the provided details
        const newUser = new User({
            username,
            email,
            dateOfBirth,
            admin,
            password 
        });

        //Save new user to database
        const savedUser = await newUser.save();

        // Generate JWT token for the newly registered user
        const token = jwt.sign(
            { _id: savedUser._id },// Payload containing the user's ID
            'secretKey', // Secret key used to sign the token
            /*process.env.JWT_SECRET,*/
            {
                expiresIn: '12h',// Token expiration time set to 12 hours
                algorithm: 'HS256'// Specify the signing algorithm 
            }
        );

        // Send the generated JWT token and saved user details in the response
        res.status(201).json({ token, user: savedUser });
        console.log(savedUser);

    } 
    catch (error) {
        console.error('Failed to add User');//Log an error message in the console for debugging purpose
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})


//-------------PUT-----------------
//Route to edit a user account
router.put('/editAccount/:id', async (req, res) => {
    console.log('edit Account');// Log a message in the console for debugging purposes
    try {        
        // Extract the user ID from the request parameters
        const { id } = req.params;
        // Extract the username and email from the request body
        const { username, email } = req.body;


        // Create an object to hold the fields that will be updated
        const updateUser = {};
        if (username) updateUser.username = username; 
        if (email) updateUser.email = email; 

        // Find the user by ID and update the relevant fields
        const updatedAccount = await User.findByIdAndUpdate(
            id, // The ID of the user to update
            updateUser, // The fields to update
            { new: true } // Return the updated document
        );


        //Conditional rendering to check if the updated user is found
        if (!updatedAccount) {
            return res.status(404).json({ message: 'User not found' })
        }
        console.log('Updated User Account:', updatedAccount);
        res.status(201).json(
            { 
                message: 'User account successfully updated', 
                updatedAccount 
            }
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
        // Extract the user ID from the request parameters
        const { id } = req.params; 
        // Find the user by ID and delete the document
        const removedUser = await User.findByIdAndDelete(id);

        if (!removedUser) {                    
            return res.status(404).json({ message: 'User not found' });
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