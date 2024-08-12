// Import necessary modules and packages
const express = require('express');
const router = express.Router();
// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');
const cors = require('cors');
//Schemas
const User = require ('../models/userSchema');
// const {authenticateToken} = require('./middleware');

//=======SETUP MIDDLEWARE===========
router.use(cors());
router.use(express.json());

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
    console.log('Finding User');
    try {
        // Retrieve the user ID from the authenticated token
        const user = await User.findById(req.user.userId);
        
         if (!user) {
            console.error('User not found');
            return res.status(400).json(
                { message: 'User Not Found'}
            )
         }

        res.status(200).json(user);
        console.log('User details', user);
         
    } 
    catch (error) {
        console.error('Error fetching Users', error.message);
        res.status(500).json(
            {message: 'Internal Server Error', error: error.message}
        )
    }
})


//Route to GET all users
router.get('/findUsers', async (req, res) => {
    console.log('Finding Users');

    try {
        const { username } = req.query;
        const query = username ? { username } : {};
        const users = await User.find(query);
    
        console.log(users);
        res.status(200).json(users);
    } 
    catch (error) {
        console.error('Error fetching users', error.message);
        res.status(500).json({ message: 'Internal server Error' });
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

        if (password === user.password) {
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

        res.status(200).json(user);
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: 'Failed to delete User' });
    }
})



// Export the router to be used in other parts of the application
module.exports = router;