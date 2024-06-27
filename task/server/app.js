// Import required modules
const express = require('express');// Import Express Web framework for handling HTTP requests
const mongoose = require('mongoose');//Import the Mongoose library
const cors = require('cors');// Middleware for enabling Cross-Origin Resource Sharing
//Import routes
const userRouter = require('./routes/users');
const quizRouter = require('./routes/quiz');
require('dotenv').config();// Load environment variables from a .env file

//Extract Environmental Variables
const uri = process.env.DATABASE_URL;//Extract the database URL from the enviromental variables
const database = process.env.DATABASE_NAME;//Extract the database name from enviromental variables
const port = process.env.PORT || 3001;//Extract the PORT number from the enviromental variables

const app = express();// Create an Express application

//=====CHECK IF ALL THE ENVIRONMENTAL VARIABLES A PRESENT=============
// Conditional rendering to check if the PORT environment variable is missing
if (!port) {
    console.error('Error: PORT environment variable is missing');;// If PORT is missing, log an error message to the console for debugging purposes
    process.exit(1);// Exit the Node.js process with a non-zero exit code (1)
}
// Conditional rendering to check if the DATABASE_NAME environment variable is missing
if (!database) {
    console.error('Error: DATABASE_NAME environment variable is missing');// If DATABASE_NAME is missing, log an error message to the console for debugging purposes
    process.exit(1) // Exit the Node.js process with a non-zero exit code (1)
}
// Conditional rendering to check if the DATABASE_URL environment variable is missing
if (!uri) {
    console.error('Error: DATABASE_URL environment variable is missing');// If DATABASE_URL is missing, log an error message to the console for debugging purposes
    process.exit(1);// Exit the Node.js process with a non-zero exit code (1)
}


//==========CONNECT TO MONGODB================

mongoose.Promise = global.Promise;// Set Mongoose's default promise library to Node.js global promise

mongoose.connect(uri, {
    // useNewUrlParser: true,// Use the new URL parser
    // useUnifiedTopology: true,// Use the new Server Discover and Monitoring engine
    dbName: database,// Specify the name of the MongoDB database
})
    .then(() => {//Execute when the connection is successful
        console.log('Connected to MongoDB');//Log a success message if the connection is successful for debugging purposes
    })
    .catch((err) => {//Execute if a connection error occurs
        console.error('Error connecting to MongoDB', err);//Log an error message if the connection is unsuccessful for debugging purposes
        process.exit(1);// Exit the Node.js process with a non-zero exit code (1)
    });


//==========MONGODB CONNECTION EVENT HANDLERS==========
// Set up an event listener for the 'error' event on the Mongoose connection
// Function executed when there is an error in the MongoDB connection
mongoose.connection.on('error', (error) => {
    console.error('Could not connect to the database. Exiting now...', error);//Log and error message in the console for debugging purposes
    process.exit(1);// Exit the process with an error code
});
// Set up an event listener for the 'open' event on the Mongoose connection
// Function executed when the MongoDB connection is successfully open
mongoose.connection.once('open', () => {
    console.log('Successfully connected to database');//Log a success message in the console for debugging purposes 
});

//==========SETUP MIDDLEWARE=========
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

//============ROUTES================
app.use('/users', userRouter )// Mount user routes defined in ./routes/users at /users endpoint
app.use('/quiz', quizRouter )// Mount quiz routs defined in ./routes/quiz at /quiz endpoint
//======START THE SERVER=============
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);// Log server startup message in the console for debugging purposes
});
