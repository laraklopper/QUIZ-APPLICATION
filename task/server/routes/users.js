const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
//Schemas
const User = require('../models/userSchema')
import { checkAge, checkJwtToken } from '../middleware/middleware';

//=========SETUP MIDDLEWARE============
router.use(cors());
router.use(express.json());

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
router.get('/user', checkJwtToken ,async (req, res) => {
    console.log('Finding user');
    //console.log(req.body)
    try {
        const user = await User.findOne({ username: req.user.username })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.json(user)

        res.status(200).json({ message: 'Successfully fetched user details' });
        console.log('user details:', user);
    }
    catch (error) {
        console.error('Error fetching users', error.message);
        res.status(500).json({ message: 'Failed to fetch user details', error: error.message });
    }
})

//Route to GET all users 
router.get('/findUsers', checkJwtToken, async (req, res,) => {
    console.log('Finding users')
    //console.log(req.body);
    try {
        const { username } = req.body;
        const users = await User.find({ username });

        console.log(users);
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users', error.message);
        res.status(500).json({ message: 'Internal server Error' });
    }
});

//----------POST-------------
//Route to send POST request to login endpoint
router.get('/login', async (req, res) =>{
    console.log(req.body);
    
    try {
        const {username, email, password} = req.body
        const user = await User.findOne({username, email, password})
        console.log(user);

        if (user) {
            if (username === user.username && password === user.password) {
                const jwtToken = jwt.sign(
                    {userId: user._id},
                    'secretKey', 
                    /*process.env.JWT_SECRET,*/
                    {
                        expiresIn: '12h',
                        algorithm: 'HS256',
                    }
                );
                res.json({'token': jwtToken})
            } else {
                throw new Error('Password Incorrect');
            }
            
        } else {
            throw new Error('User not found')
            
        }
    } catch (error) {
        console.error('Login Failed: Username or password are incorrect');
        res.status(401).json({ message: 'User not authenticated' })
    }
})

//Route to send a POST request the register endpoint
router.post('/register', checkAge, async (req, res) => {
    // console.log('Register User');
    console.log(req.body);
    try {
        const {username, email, dateOfBirth, password, admin = false} = req.body;
        const existingUser = await User.findOne({username});

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        };

        const newUser = new User({
            username,
            email,
            dateOfBirth,
            admin,
            password
        });

        const savedUser = await newUser.save();

        const token = jwt.token(
            {_id : savedUser._id},
            'secretKey',
            /*process.env.JWT_SECRET,*/
            {
                expiresIn: '12h',
                 algorithm: 'HS256'
                }
        );

        res.status(201).json({ token, user: savedUser });
        console.log(savedUser);


    } catch (error) {
        console.error('Failed to add User');
        return res.status(500).json({error: 'Internal Server Error'})
    }
})


//Route to send a DELETE request to the /deleteUser endpoint
router.delete('/deleteUser/:id', checkJwtToken, async (req, res) => {
    try {
        const {id} = req.params;

        const removedUser = await User.findByIdAndDelete(id);

        if (!removedUser) {
            return res.status(404).json({message: 'User not found'})
        }

        res.json({
            message: 'User Successfully deleted',
            deletedUserId: removedUser._id
        })

        res.status(200).json(user);
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({error: 'Failed to delete User'})
    }
})



module.exports = router