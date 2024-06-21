// Import necessary modules and packages
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cors = require('cors');
//Schemas
const User = require ('../models/userSchema');
const Quiz = require ('../models/quizSchema')

//=========SETUP MIDDLEWARE============
router.use(cors());
router.use(express.json());

//============CUSTOM MIDDLEWARE=====================
// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

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
router.get('/userId', authenticateToken, async (req, res) => {
    console.log('Finding user');
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
      console.error('User not found');
      return res.status(400).json({ message: 'User Not Found' });
    }
        res.status(200).json(user);
        console.log('User details', user);
    }
    catch (error) {
     // Log any errors that occur during the process
      console.error('Error fetching Users', error.message);
      res.status(500).json({message: 'Internal Server Error', error: error.message})

    }
})

//Route to handle GET request to fetch all users 
router.get('/findUsers', async (req, res,) => {
    console.log('Finding users');
    try {
        const { username } = req.query;
        const query = username ? { username } : {}; 
        const users = await User.find(query);

        console.log(users);
        res.status(200).json(users);
    }
    catch (error) {
        //Error handling
        console.error('Error fetching users', error.message);
        res.status(500).json({ message: 'Internal server Error' });
    }
});

// Route to fetch all quizzes
router.get('/getQuizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find()        
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//----------POST-------------
//Route to send POST request to login endpoint
router.post('/login', async (req, res) =>{
    console.log(req.body);
    console.log('User Login');
    
    try {
        
        const {username, password} = req.body;
        const user = await User.findOne({username, password});
        console.log(user);

        if (!user) {
            throw new Error('User not found');
        }

        if (password === user.password) {
            const jwtToken = jwt.sign(
                { userId: user._id },
                        'secretKey',
                        /*process.env.JWT_SECRET,*/
                        {
                            expiresIn: '12h'
                            algorithm: 'HS256',
                        }
                    );
            res.json({ 'token': jwtToken })
        } 
        else {
            throw new Error('Password Incorrect');
        }
    } 
    catch (error) 
    {
        console.error('Login Failed: Username or password are incorrect', error.message);
        res.status(401).json({ message: 'User not authenticated' }); 
    }
})

//Route to send a POST request the register endpoint
router.post('/register', async (req, res) => {
    // console.log('Register User');
    console.log(req.body);
    try {
        const { username, email, dateOfBirth, password, admin = false } = req.body;
        
          const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        };
        
                 if (!username || !email || !dateOfBirth || !password) {
              console.error('Username and password are required');
              return res.status(400).json({ message: 'Username and password are required' });
            }
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

        const savedUser = await newUser.save();
        
        const token = jwt.sign(
            { _id: savedUser._id, 
             // username: savedUser.username 
            },
            'secretKey',//SecretKey
            /*process.env.JWT_SECRET,*/
            {
                expiresIn: '12h',
                 algorithm: 'HS256'
                }
        );

        // Respond with the JWT token and user details
        res.status(201).json({ token, user: savedUser });
        console.log(savedUser);


    } catch (error) {
        console.error('Failed to add User');
        return res.status(500).json({error: 'Internal Server Error'})
    }
})

// Route to send a POST request to addQuiz endpoint
router.post('/addQuiz', async (req, res) => {
    console.log(req.body);
    console.log('Add Quiz')
    try {
        const quiz = new Quiz(req.body);
        
        // await quiz.save();
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const newQuiz = new Quiz({
            quizName: req.body.quizName,
            user: user._id, 
            questions: req.body.questions
        });
          // Save the new quiz to the database
        const savedQuiz = await newQuiz.save();
        
        res.status(201).json(savedQuiz);
    } catch (error) {
        console.error(`Error occurred while adding new Quiz`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

//-------------PUT-----------------
// Route to handle PUT requests to edit a user's account
router.put('/editAccount:_id', async (req, res) => {
    console.log('edit Account');
    try {
        const {_id} = req.params;
        const {username, email} = req.body;

        // Create an object to hold the updated fields
        const updateUser = {}
        if (username) updateUser.username = username;
        if (email) updateUser.email = email;

        const updatedAccount = await User.findByIdAndUpdate(
            _id,
            updateUser,
            { new: true }
        )

        if (!updatedAccount) {
            return res.status(404).json({ message: 'User not found' })
        }
        console.log('Updated User Account:', updatedAccount);
        res.status(201).json(
            { message: 'User account successfully updated', updatedAccount }
        )
    } catch (error) {
        console.error(`Error occured while updating User Account ${error.message}`);
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
        res.status(500).json({error: 'Failed to delete User'});
    }
})

// Route to delete a quiz
router.delete('/deleteQuiz/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Quiz.findByIdAndDelete(id);

           if (!removedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json({ message: 'Quiz successfully deleted' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;// Export the router to be used in other parts of the application
