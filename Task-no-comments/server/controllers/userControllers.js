// Import necessary modules and packages
const User = require('../models/userSchema')
const jwt = require('jsonwebtoken');

//=============CRUD OPERATIONS==================
/*
|============================|
| CRUD OPERATION | HTTP VERB |
|================|===========|
|CREATE          | POST      | 
|----------------|-----------|
|READ            | GET       |  
|----------------|-----------|     
|UPDATE          | PUT       |
|----------------|-----------|
|DELETE          | DELETE    |
|================|===========|
*/
//------------------GET---------------
//Controller function to fetch a single user
const findUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json(
                {error: 'User not found'});
        }
        res.status(200).json(user)
        console.log(user);
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({error: 'Error finding user'})
    }
}

//Controller function to fetch all users
const findUsers = async (req, res) => {
    console.log(req.body);
    try {
        const { username } = req.query;
        const query = username ? { username } : {};
        const users = await User.find(query);

        console.log(users);
        res.status(200).json(users);

    } catch (error) {
        console.error('Error fetching users', error.message);
        res.status(500).json({ message: 'Internal server Error' });
    }
}
//-----------POST---------------------
//Controller function to add a new user

const addUser = async (req, res) => {
    console.log(req.body);

    try {
        const { username, email, dateOfBirth, password, admin = false } = req.body;
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
    } catch (error) {
        console.error('Failed to add User');
        return res.status(500).json(
            { error: 'Internal Server Error' }
        )
    }
}

//Controller function to submit user login
const login = async (req,res) => {
    // console.log('user login');
    console.log(req.body);
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username, password})

        if (!user) {
            throw new Error ('User not found')            
        }

        if(password === user.password){
            const jwtToken = jwt.sign(
                {userId : user._id},
                'secretKey',
                {
                    expiresIn: '12h',
                    algorithm: 'HS256',
                }
            )
            res.json({'token': jwtToken})
        }
        else{
            throw new Error('Password Incorrect')
        }
    } catch (error) {
        console.error('Login Failed: Username or password are incorrect');
        res.status(401).json(
            { message: 'User not authenticated' })
    }


}
//-------------PUT-----------------
// Controller function to update a useraccount
const editAccount = async (req, res) => {
    console.log('Editing account');

    try {
        const { id } = req.params
        const { username, email } = req.body

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
            { message: 'User account successfully updated', updatedAccount })
    } 
    catch (error) {
        console.error(`Error occured while updating User Account ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' })
    }
}
//------------DELETE---------------
//Controller function to delete a user
const deleteUser = async (req, res) => {
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
    } 
    catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json(
            { error: 'Failed to delete User' });
    }
}

module.exports = {
    login, 
    addUser, 
    findUser, 
    findUsers, 
    editAccount, 
    deleteUser
}
