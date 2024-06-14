
### Importing Modules and Packages

```javascript
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('../models/userSchema');
const Quiz = require('../models/quizSchema');
```
- `express`: A web framework for Node.js.
- `router`: An instance of `express.Router` to define routes.
- `jwt`: JSON Web Token (JWT) for authentication.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing.
- `User` and `Quiz`: Mongoose models for `User` and `Quiz` collections.

### Middleware Setup

```javascript
router.use(cors());
router.use(express.json());
```
- `cors()`: Allows Cross-Origin requests.
- `express.json()`: Parses incoming JSON requests.

### Routes

#### GET Routes

1. **Get a Single User**

```javascript
router.get('/', async (req, res) => {
    console.log('Finding User');
    try {
        const user = await User.findOne({ _id: req.user.userId });
        if (!user) {
            console.error('User not found');
            return res.status(400).json({ message: 'User Not Found' });
        }
        res.status(200).json({ message: 'Successfully fetched User details' });
        console.log('User details', user);
    } catch (error) {
        console.error('Error fetching Users', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
```
- Fetches a user based on the `userId` from the request.
- Returns user details or an error message if the user is not found.

2. **Get All Users**

```javascript
router.get('/findUsers', async (req, res) => {
    console.log('Finding Users');
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
});
```
- Fetches all users or users matching a specific username.
- Returns a list of users.

#### POST Routes

1. **User Login**

```javascript
router.post('/login', async (req, res) => {
    console.log(req.body);
    console.log('User Login');
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        console.log(user);
        if (!user) {
            throw new Error('User not found');
        }
        if (password === user.password) {
            const jwtToken = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '12h', algorithm: 'HS256' });
            res.json({ 'token': jwtToken });
        } else {
            throw new Error('Password Incorrect');
        }
    } catch (error) {
        console.error('Login Failed: Username or password are incorrect');
        res.status(401).json({ message: 'User not authenticated' });
    }
});
```
- Authenticates a user with a username and password.
- Returns a JWT if authentication is successful.

2. **User Registration**

```javascript
router.post('/register', async (req, res) => {
    console.log(req.body);
    try {
        const { username, email, dateOfBirth, password, admin = false } = req.body;
        if (!username || !email || !dateOfBirth || !password) {
            console.error('Username and password are required');
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const newUser = new User({ username, email, dateOfBirth, admin, password });
        const savedUser = await newUser.save();
        const token = jwt.sign({ _id: savedUser._id }, 'secretKey', { expiresIn: '12h', algorithm: 'HS256' });
        res.status(201).json({ token, user: savedUser });
        console.log(savedUser);
    } catch (error) {
        console.error('Failed to add User');
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
```
- Registers a new user.
- Checks for required fields and existing username.
- Saves the new user and returns a JWT.

3. **Add Quiz**

```javascript
router.post('/addQuiz', async (req, res) => {
    console.log(req.body);
    try {
        const quiz = new Quiz(req.body);
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const newQuiz = new Quiz({ quizName: req.body.quizName, user: user._id, questions: req.body.questions });
        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
    } catch (error) {
        console.error(`Error occurred while adding new Task`);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
```
- Adds a new quiz associated with a user.
- Saves the new quiz and returns it.

#### PUT Route

1. **Edit User Account**

```javascript
router.put('/editAccount:_id', async (req, res) => {
    console.log('edit Account');
    try {
        const { _id } = req.params;
        const { username, email } = req.body;
        const updateUser = {};
        if (username) updateUser.username = username;
        if (email) updateUser.email = email;
        const updatedAccount = await User.findByIdAndUpdate(_id, updateUser, { new: true });
        if (!updatedAccount) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Updated User Account:', updatedAccount);
        res.status(201).json({ message: 'User account successfully updated', updatedAccount });
    } catch (error) {
        console.error(`Error occurred while updating User Account ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
```
- Edits user account details (username and email).
- Updates the user account and returns the updated details.

### Exporting the Router

```javascript
module.exports = router;
```
- Exports the router to be used in other parts of the application.

### Summary

This module sets up an Express router with various routes to handle user login, registration, fetching user(s), adding quizzes, and updating user accounts. It uses JWT for authentication and includes error handling for different scenarios.
