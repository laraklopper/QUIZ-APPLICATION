// Import necessary modules and packages
const mongoose = require('mongoose');// Import the Mongoose library

// Define the user schema
let userSchema = new mongoose.Schema({
    // Field for username
    username:{
        type: String,//Indicate data type as a string
        required: [true, 'Username is required'],
        unique: true,// Ensure the username is unique
    },
    // Field for user email
    email:{
        type: String,//Indicate data type as a string
        required: [true, 'User email is required'],
        unique: true,
        // Automatically converts the email to lowercase before saving
        set: (v) => toLowerCase(),
    },
    //Field for user date of birth
    dateOfBirth: {
        type: Date,//Indicate data type as date
        required: [true, 'date of birth is required'],
    },
    //Optional field for admin status
    admin: {
        type: Boolean,//Indicate data type as a boolean     
        required: false,
    },
    //Field for user password
    password: {
        type: String, 
        required: [true, 'User password is required'],
        // unique: true, // Ensures the password is unique
    }
}, { timestamps: true });
/* Add timestamps for each document, 
including 'createdAt' and 'updatedAt' fields*/

// Export the users model based on the userSchema
module.exports = mongoose.model('User', userSchema);
