// Import required modules
const express = require('express');// Import Express Web framework
const mongoose = require('mongoose');//Import the Mongoose library
const cors = require('cors');
//Import routes
const userRouter = require('./routes/users');
const quizRouter = require('./routes/quiz');

// Load environment variables from a .env file
require('dotenv').config()

//Extract Environmental Variables
const port = process.env.PORT || 3001;
const database = process.env.DATABASE_NAME;
const uri = process.env.DATABASE_URL;

const app = express();// Create an Express application

//=====CHECK IF ALL THE ENVIRONMENTAL VARIABLES A PRESENT=========
if (!port) {
    console.error('Error: PORT environment variable is missing');
    process.exit(1);
}
else if(!database){
    console.error('Error: DATABASE_NAME enviromental variable is missing');
    process.exit(1);
}
else if(!uri){
    console.error('Error: DATABASE_URL enviromental variable is missing');
    process.exit(1)
};

//==============CONNECT TO MONGODB===============
mongoose.Promise = global.Promise;

mongoose.connect(uri, {
    dbName: database,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    })

//==========MONGODB CONNECTION EVENT HANDLERS==========
// Set up an event listener for the 'error' event on the Mongoose connection
// Function executed when there is an error in the MongoDB connection
mongoose.connection.on('error', (error) => {
    console.error('Could not connection the database. Exiting now...', error);
    process.exit(1);
})
// Set up an event listener for the 'open' event on the Mongoose connection
// Function executed when the MongoDB connection is successfully open
mongoose.connection.once('open', () => {
    console.log('Successfully connected to the database');
});

//===========SETUP MIDDLEWARE==================
app.use(cors());
app.use(express.json());

//============ROUTES================
app.use('/users', userRouter )
app.use('/quiz', quizRouter )

//=================START THE SERVER=======================
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
} )