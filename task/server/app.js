const express = require('express');
const routes = require()
const mongoose = require('mongoose');

require('dotenv').config();
const uri = process.env.MONGODB_URL;
const database = process.env.DATABASE_NAME;
const port = process.env.PORT || 3001;
const app = express();

//==========SETUP MIDDLEWARE=========
app.use(cors())
app.use(express.json())


mongoose.connect(uri, {
    useNewUrlParser: true,
    dbName: database,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    })

mongoose.connection.on('error', function(error) {
    console.log('Could not connect to the database. Exiting now...', error);
})

mongoose.connection.once('open', function () {
    console.log('Successfully connected to database');
});

app.use('/users', routes)
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})