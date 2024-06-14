// Import necessary modules and packages
const express = require('express');// Import Express Web framework 
const router = express.Router();// Create an Express router
const cors = require('cors');//Import Cross-Origin Resource Sharing middleware
// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');
//Schemas
const User = require('../models/userSchema');// Import the User model

//=========SETUP MIDDLEWARE============
router.use(cors());// Enable Cross-Origin Resource Sharing for all routes
router.use(express.json());// Parse JSON bodies for incoming requests


//========ROUTES==============

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

//-----------GET--------------
//Route to handle GET requests to fetch a single user
router.get('/user', /*authenticateToken,*/ async (req, res) => {
    console.log('Finding user');//Log a message in the console for debugging purposes
    try {
        // const user = await User.findOne({ username: req.user.username })
        // Attempt to find a user by the user ID provided in the request object
        const user = await User.findOne({ _id: req.user.userId });

        //Conditional rendering to check if the user is found
        if (!user) {
            return res.status(404).json({ message: 'User not found' }) // If user is not found, return 404 status with an error message
        }

        // Respond with the user details
        res.status(200).json({ message: 'Successfully fetched user details' });   // If user is found, send a 200 status with a success message
        console.log('user details:', user);// Log the user details in the console for debugging purposes
    }
    catch (error) {
                // Log any errors that occur during the process
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Failed to fetch user details', error: error.message });// Send a 500 status with an error message indicating a server error

    }
})

//Route to handle GET request to fetch all users 
router.get('/findUsers', async (req, res,) => {
    console.log('Finding users'); //Log a message a message in the console to indicate the start of the user fetching process.    
    try {
        // Find users optionally filtered by username
        const { username } = req.query;// Extract username from request query
        const query = username ? { username } : {}; // Construct query object: if username is provided, filter by username, otherwise, fetch all users
        // const users = await User.find({ username });
        const users = await User.find(query);// Fetch users from the database based on the query
        console.log(users);// Log the users in the console for debugging purposes
            // Send a 201 Created response with a success message and the saved user object
        res.status(200).json(users);// Return found users
    }
    catch (error) {
        //Error handling
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Internal server Error' });// Send 500 status code and error message in JSON response
    }
});

// Route to fetch all quizzes
/*router.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});*/
router.get('/getQuizzes', async (req, res) => {
    try {
        // Find all quizzes and populate the user field with username
        const quizzes = await Quiz.find().populate('user', 'username');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//----------POST-------------
//Route to send POST request to login endpoint
router.post('/login', async (req, res) =>{
    console.log(req.body);//Log the request body in the console for debugging purposes
    console.log('User Login')//Log a message in the console for debugging purposes
    
    try {
        
        const {username, password} = req.body;//Extract the username and password from the request body
        const user = await User.findOne({username, password});// Find the user in the database by username and password
        console.log(user);//Log the user details in the console for debugging purposes

        //Conditional rendering to check if the user exists
        if (!user) {
            throw new Error('User not found');//Throw an error if the user is not found
        }

    // Conditional rendering to check if the provided password matches the user's password
        if (password === user.password) {
            const jwtToken = jwt.sign(
                { userId: user._id },//Payload containing userId
                        'secretKey',//SecretKey
                        /*process.env.JWT_SECRET,*/
                        {// Token expiration time and algorithm
                            expiresIn: '12h',// Token expiration time
                            algorithm: 'HS256',// Token signing algorithm
                        }
                    );
            res.json({ 'token': jwtToken })// Respond with the JWT token
        } 
        else {
            throw new Error('Password Incorrect');
        }
    } 
    catch (error) 
    {
        console.error('Login Failed: Username or password are incorrect', error.message);//Log an error message in the console for debugging purposes
        res.status(401).json({ message: 'User not authenticated' }); // Send a 401 (Unauthorized) status code and error message in JSON response
    }
})

//Route to send a POST request the register endpoint
router.post('/register', async (req, res) => {
    // console.log('Register User');
    console.log(req.body);//Log the request body in the console for debugging purposes
    try {
        const { username, email, dateOfBirth, password, admin = false } = req.body;//Extract the registration details from the request body
        
        // Conditional rendering to check if username already exists
          const existingUser = await User.findOne({ username });
        if (existingUser) {
            // If username already exists, return error response
            return res.status(400).json({ message: 'Username already exists' });
        };
        
        //Conditional rendering to check if the required fields are provided
                 if (!username || !email || !dateOfBirth || !password) {
              console.error('Username and password are required');
              return res.status(400).json({ message: 'Username and password are required' });
             /*If any field is missing, it returns a 400 (Bad Request) response with an error message*/
            }
        // Conditional rendering to check if the username already exists in the database
        const existingUser = await User.findOne({username});
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        };

        //Create a new user
        const newUser = new User({
            username,
            email,
            dateOfBirth,
            admin,
            password
        });

        const savedUser = await newUser.save();// Save the new user to the database

        // Generate a JWT token for the new user
        const token = jwt.token(
            { _id: savedUser._id, username: savedUser.username },//Payload containing userId
            'secretKey',//SecretKey
            /*process.env.JWT_SECRET,*/
            {
                expiresIn: '12h',//Token expiration time
                 algorithm: 'HS256'//algorithm
                }
        );

        // Respond with the JWT token and user details
        res.status(201).json({ token, user: savedUser });
        console.log(savedUser);//Log the new user details in the console for debugging purposes


    } catch (error) {
        console.error('Failed to add User');//Log an error message in the console for debugging purposes
        return res.status(500).json({error: 'Internal Server Error'})//Send a 500 (Internal Server Error) status response in the JSON response
    }
})

// Route to send a POST request to addQuiz endpoint
router.post('/addQuiz', async (req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purposes
    // console.log('Add Quiz')
    try {
        const quiz = new Quiz(req.body);// Create a new Quiz instance with the data from the request body

        // await quiz.save();
        // Find the user by their ID from the request (assumes authentication middleware has set req.user)
        const user = await User.findById(req.user.userId);
        // Conditional rendering to check if the user exists
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

         // Create a new Quiz instance with additional details: quizName, user ID, and questions
        const newQuiz = new Quiz({
            quizName: req.body.quizName,
            user: user._id, // Reference the user's ObjectId
            questions: req.body.questions
        });
          
        const savedQuiz = await newQuiz.save();// Save the new quiz to the database
        
        res.status(201).json(savedQuiz);// Respond with a 201 status and the saved quiz data in JSON format

    } catch (error) {
        console.error(`Error occurred while adding new Quiz`, error);//Log an error message in the console for debugging purposes
        // Respond with a 500 (Internal Server Error)status and an error message indicating a server error
        return res.status(500).json({ message: 'Internal Server Error' });//
    }
});

//-------------PUT-----------------
// Route to handle PUT requests to edit a user's account
router.put('/editAccount:_id', async (req, res) => {
    console.log('edit Account');//Log a message to in the console  to indicate the start of the account editing process.
    try {
        const {_id} = req.params//Extract userId from the request parameters
        const {username, email} = req.body// Extract the new username and email from the request body

        // Create an object to hold the updated fields
        const updateUser = {}
        if (username) updateUser.username = username// If username is provided, add it to updateUser
        if (email) updateUser.email = email;// If email is provided, add it to updateUser

        // Find the user by ID and update their details with the updateUser object
        // { new: true } option returns the updated document
        const updatedAccount = await User.findByIdAndUpdate(
            _id,
            updateUser,
            { new: true }
        )

        //Conditional rendering to check if the user was found and updated
        if (!updatedAccount) {
            return res.status(404).json({ message: 'User not found' })
        }
        console.log('Updated User Account:', updatedAccount);//Log the updated user account details in the console for debugging purposes
                // Respond with a 201 status and a success message along with the updated account details
        res.status(201).json(
            { message: 'User account successfully updated', updatedAccount }
        )
    } catch (error) {
        console.error(`Error occured while updating User Account ${error.message}`);//Log an error message in the console for debugging purposes
                // Respond with a 500 (Internal Server Error) status and an error message indicating a server error
        return res.status(500).json({ message: 'Internal server error' });

    }
})

// Route to edit a quiz
router.put('/editQuiz/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedQuiz);
    } catch (error) {
        console.error('Error editing quiz:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

//--------------DELETE--------------------
//Route to send a DELETE request to the /deleteUser endpoint
router.delete('/deleteUser/:id',  async (req, res) => {
    try {
        const {id} = req.params;// Extract the user ID from the request parameters

        const removedUser = await User.findByIdAndDelete(id);//Find the user and delete the user by ID

        //Conditional rendering to check if the removed user exists in the database
        if (!removedUser) {
            //If the user is not found, return a 404 (Not Found) response with an error message
            return res.status(404).json({message: 'User not found'})
        }

        res.json({//Send a JSON response back to the client
            message: 'User Successfully deleted',//Message indicating that the user was successfully deleted
            deletedUserId: removedUser._id //Deleted/removed user ID
        })

        res.status(200).json(user);
    } catch (error) {
        console.error('Error deleting user:', error.message);// Log the error message in the console for debugging purposes
        res.status(500).json({error: 'Failed to delete User'});// Send a 500 Internal Server Error response with an error message
    }
})

// Route to delete a quiz
router.delete('/deleteQuiz/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Quiz.findByIdAndDelete(id);
        res.status(200).json({ message: 'Quiz successfully deleted' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;// Export the router to be used in other parts of the application
