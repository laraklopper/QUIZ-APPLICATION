// Import the Mongoose library
const mongoose = require('mongoose');

// Define the user schema
let userSchema = mongoose.Schema({
    // Field for the username, which is a required string
    username: {
        type: String,       // Specifies that the username field should be of type String
        required: true,     // Makes the username field mandatory
    },
    // Field for the email, which is a required string
    email: {
        type: String,       // Specifies that the email field should be of type String
        required: true,     // Makes the email field mandatory
    },
    // Field for the date of birth, which is a required string
    dateOfBirth: {
        type: String,       // Specifies that the dateOfBirth field should be of type String
        required: true,     // Makes the dateOfBirth field mandatory
    },
    // Field for admin status, which is an optional boolean
    admin: {
        type: Boolean,      // Specifies that the admin field should be of type Boolean
        required: false,    // The admin field is optional
    },
    // Field for the password, which is a required string
    password: {
        type: String,       // Specifies that the password field should be of type String
        required: true      // Makes the password field mandatory
    }
}, 
// Enable timestamps to automatically add createdAt and updatedAt fields
{ timestamps: true });

// Export the users model based on the userSchema
module.exports = mongoose.model('users', userSchema);
