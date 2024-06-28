// Import necessary modules and packages
const express = require('express');// Import Express Web framework 
const router = express.Router();// Create an Express router
/*
The express.Router() function is used to create a new router object. 
This function is used to create a new router object to handle requests. 
*/
const cors = require('cors'); //Import Cross-Origin Resource Sharing middleware
// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');
//Schemas
const User = require ('../models/userSchema');// Import the userSchema model
//Import custom middleware
const {authenticateToken} = require('../middleware/middleware')

//=======SETUP MIDDLEWARE===========
router.use(express.json()); // Parse incoming request bodies in JSON format
/*Built-Middleware function used to parse incoming requests with JSON payloads.
Returns middleware that only parses JSON and only looks at requests where the
Content-Type header matches the type option.*/
router.use(cors()); //Enable Cross-Origin Resource sharing 

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
    console.log('Finding User');// Log a message in the console for debugging purposes
    try {
        // Retrieve user details using the authenticated user ID from req.user.userId
        const user = await User.findById(req.user.userId);

        //Conditional rendering to check if the user exists
         if (!user) {
            console.error('User not found');//Log an error message in the console for debugging purposes
            return res.status(400).json(// Return a JSON response with a 400 status code and 'User Not Found' message.
                { message: 'User Not Found'}
            )
         }

        res.status(200).json(user);//If the user is found, sends a JSON response with the user details and a 200 status code (OK).
        console.log('User details', user);//Log the user details to the console for debugging purposes.
         
    } 
    catch (error) {
        console.error('Error fetching Users', error.message);// Log error message in the console for debugging purposes
        /* If an error occurs during database operation, 
    return a 500 Internal Server Error response*/
        res.status(500).json(
            {message: 'Internal Server Error', error: error.message}
        )
    }
})


//Route to GET all users
router.get('/findUsers', async (req, res) => {
    console.log('Finding Users');//Log a message in the console for debugging purposes

    try {
        const { username } = req.query;// Extract the username from query parameters
        const query = username ? { username } : {};// Create a MongoDB query object based on whether username is provided or not
        const users = await User.find(query);// Using the User model to find users based on the query
    
        console.log(users);Log the fetched users to the console for debugging purposes
        res.status(200).json(users);// Send a JSON response with the found users and a 200 (OK) status code
    } 
    catch (error) {
        console.error('Error fetching users', error.message);// Log error message in the console for debugging purposes
        res.status(500).json({ message: 'Internal server Error' });// Send a 500 (Internal Server Error)status code and an error message in case of an error
    }

})

//-------------POST-------------------
//Route to send POST request to login endpoint
router.post('/login', async (req, res) => {
    console.log(req.body);// Log the request body containing the username and password
    console.log('User Login');// Log a message in the console indicating user login for debugging purposes

    try {
        
        const { username, password } = req.body;// Extract username and password from the request body
        const user = await User.findOne({ username, password });// Find the user in the database by username and password
        console.log(user);// Log a message in the console indicating user login for debugging purposes

        //Conditional rending to check if the user is found
        if (!user) {
            throw new Error('User not found')// Throw error if user is not found
        }

      // Conditional rendering to check if the provided password matches the user's password
        if (password === user.password) {
            // Generate a JWT token for authentication
            const jwtToken = jwt.sign(
                { userId: user._id },// Payload of the JWT token containing the user's ID
                        'secretKey',// Secret key used to sign the token 
                        /*process.env.JWT_SECRET,*/
                        {
                            expiresIn: '12h',//Token expiry time
                            algorithm: 'HS256',// Algorithm used to sign the token (HMAC SHA-256)
                        }
                    );
            res.json({ 'token': jwtToken })// Send the generated JWT token as a response
        } 
        else {
            throw new Error('Password Incorrect');// Throw an error if the password does not match
        }
     
    } catch (error) {
        console.error('Login Failed: Username or password are incorrect');// Log error message in the console for debugging purposes
        res.status(401).json({ message: 'User not authenticated' })//Send a JSON 401 status and error message
    }
})

//Route to send a POST request the register endpoint
router.post('/register', async (req, res) => {
    console.log(req.body);// Log the request body in the console for debugging purposes
    try {
        //Extract the request body from the console
        const {username, email, dateOfBirth, password, admin = false } = req.body;

        //Conditional rendering to check if all the required fields are provided
        if (!username || !email || !dateOfBirth || !password) {
          console.error('Username and password are required');// Log error message in the console for debugging purposes
          return res.status(400).json(
            { message: 'Username and password are required' }
        );
        }
      
         // Conditional rendering to check if username already exists in the database
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        
      // Create a new User instance
        const newUser = new User({
            username,
            email,
            dateOfBirth,
            admin,
            password
        });


        const savedUser = await newUser.save(); // Save the new user to the database

        // Generate JWT token for the registered user
        const token = jwt.sign(
            { _id: savedUser._id },
            'secretKey',// Secret key used to sign the token 
            /*process.env.JWT_SECRET,*/
            {
                expiresIn: '12h',// Token expiry time 
                algorithm: 'HS256'// Algorithm used for token signing
            }
        );

         
      
        // Respond with the token and the saved user details
        res.status(201).json({ token, user: savedUser });
        console.log('User registered successfully:', savedUser);

    } 
    catch (error) {
        console.error('Failed to add User');//Log an error message in the console for debugging purposes
        return res.status(500).json(// Send 500 status code and error message in JSON response
            { error: 'Internal Server Error' }
        )
    }
})

//-------------PUT-----------------
// Route to update user account
router.put('/editAccount/:id', async (req, res) => {
    console.log('edit Account'); // Log a message in the console for debugging purposes

    try {
        const { id } = req.params; // Extract user ID from request parameters
        const { username, email } = req.body; // Extract the updated username and email from request body

        const updateUser = {}; // Initialize an empty object to store updated user details
        if (username) updateUser.username = username; // If username is provided in request body, update it
        if (email) updateUser.email = email; // If email is provided in request body, update it

        // Find and update the user account in the database
        const updatedAccount = await User.findByIdAndUpdate(
            id, // User ID to find and update
            updateUser, // Updated user details
            { new: true } // Option to return the updated document
        );

        // If no user with the given ID is found, return a 404 error
        if (!updatedAccount) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log the updated user account details in the console for debugging purposes
        console.log('Updated User Account:', updatedAccount);

        // Send a success response with the updated user account details
        res.status(201).json({ message: 'User account successfully updated', updatedAccount });
    } catch (error) {
        console.error(`Error occurred while updating User Account ${error.message}`);//Log an error message in the console for debugging purposes
        return res.status(500).json({ message: 'Internal server error' });// Send 500 status code and error message in JSON response
    }
});



//---------------DELETE--------------------
//Route to send a DELETE request to the /deleteUser endpoint
router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract user ID from request parameters

        // Delete user from the database based on the user ID
        const removedUser = await User.findByIdAndDelete(id);

        // Conditional rendering to check if the removed user exists
        if (!removedUser) {
          // If the user is not found, return a 404 Not Found response with an error message
            return res.status(404).json({ message: 'User not found' });
        }

        // Sending a success response with details of the deleted user
        res.json({
            message: 'User Successfully deleted',
            deletedUserId: removedUser._id
        });

    } catch (error) {
        // Catching and handling any errors that occur during the deletion process
        console.error('Error deleting user:', error.message);// Log the error message in the console for debugging purposes
        res.status(500).json({ error: 'Failed to delete User' });// Send a 500 Internal Server Error response with an error message
    }
});


// Export the router to be used in other parts of the application
module.exports = router;
