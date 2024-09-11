// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//Import routes
const userRouter = require('./routes/users');
const quizRouter = require('./routes/quiz');
const scoreRouter = require('./routes/scores');
/* Load environment variables from a .env file 
using the dotenv package*/
require('dotenv').config()

//Extract Environmental Variables
const port = process.env.PORT || 3001;
const database = process.env.DATABASE_NAME;
const uri = process.env.DATABASE_URL;

const app = express();// Create an Express application

//=====CHECK IF ALL THE ENVIRONMENTAL VARIABLES A PRESENT=========
// Conditional rendering to check if the port environmental variable is missing
if (!port) {
    console.error('Error: PORT environment variable is missing');
    process.exit(1);// Exit the process with a failure code
}
// Conditional rendering to check if the database environmental variable is missing
else if(!database){
    console.error('Error: DATABASE_NAME enviromental variable is missing');
    process.exit(1);// Exit the process with a failure code
}
    // Conditional rendering to check if the port environmental variable is missing
else if(!uri){
    console.error('Error: DATABASE_URL enviromental variable is missing');
    process.exit(1)// Exit the process with a failure code
};

//==============CONNECT TO MONGODB===============
//mongoose.Promise = global.Promise; // Use native promises

mongoose.connect(uri, {
    dbName: database,  // Specify the database name
    // useNewUrlParser: true,  
    // useUnifiedTopology: true, 
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1); // Exit the process with a failure code
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
app.use('/users', userRouter);
app.use('/quiz', quizRouter);
app.use('/scores', scoreRouter);

//=================START THE SERVER=======================
// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
} )
