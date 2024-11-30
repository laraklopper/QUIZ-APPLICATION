// Import required modules and packages
const express = require('express');// Import Express Web framework
const mongoose = require('mongoose');//Import the Mongoose library
const cors = require('cors');// Import CORS (Cross-Origin Resource Sharing) middleware
const helmet = require('helmet');// Import Helmet for setting secure HTTP headers
//Import routes
const userRouter = require('./routes/users');//Import user routes
const quizRouter = require('./routes/quiz');//Import quiz routes
const scoreRouter = require('./routes/scores');//Import score routes
/* Load environment variables from a .env 
file using the dotenv package*/
require('dotenv').config();

//Extract Environmental Variables
const port = process.env.PORT || 3001;//Extract the port environmental variable 
const database = process.env.DATABASE_NAME;//Extract the Database name environmental variable
const uri = process.env.DATABASE_URL;//Extract the Database URL environmental variable

const app = express();// Create an Express application

//=====CHECK IF ALL THE ENVIRONMENTAL VARIABLES A PRESENT=========
// Conditional rendering to check if the environmental variables are missing
if (!port || !database || !uri) {
    console.error('Error: Missing environmental variables');//Log an error message in the console for debugging purposes
    process.exit(1)// Exit the process with a failure code
}

//==============CONNECT TO MONGODB===============
//mongoose.Promise = global.Promise; // Use native promises

mongoose.connect(uri, {
 dbName: database,  // Specify the database name
})
    .then(() => {
        console.log('Connected to MongoDB');//Log a success message in the console for debugging purposes
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);//Log an error message for debugging purposes
        process.exit(1); // Exit the process with a failure code
    })

//==========MONGODB CONNECTION EVENT HANDLERS==========
// Set up an event listener for the 'error' event on the Mongoose connection
// Function executed when there is an error in the MongoDB connection
mongoose.connection.on('error', (error) => {
    console.error('Could not connection the database. Exiting now...', error);//Log an error message in the console for debugging purposes
    process.exit(1);//Exit the process with a failure code
})
// Set up an event listener for the 'open' event on the Mongoose connection
// Function executed when the MongoDB connection is successfully open
mongoose.connection.once('open', () => {
    console.log('Successfully connected to the database');//Log a success message in the console for debugging purposes
});

//===========SETUP MIDDLEWARE==================
app.use(cors());  // Enable CORS for all routes, allowing cross-origin requests
app.use(express.json());  // Enable parsing of JSON bodies in incoming requests
app.use(helmet()) // Use Helmet for setting secure HTTP headers

//============ROUTES================
app.use('/users', userRouter);// user-related routes at the '/users' path
app.use('/quiz', quizRouter);// quiz-related routes at the '/quiz' path
app.use('/scores', scoreRouter);//score-related routes at the '/scores' path

mongoose.set('strictPopulate', false)// Disable strict population checks in Mongoose
//=================START THE SERVER=======================
// Start the server and listen on the specified port
app.listen(port, () => {
    // Log a message in the console indicating the server is running
    console.log(`Server is running on port: ${port}`);
} )
