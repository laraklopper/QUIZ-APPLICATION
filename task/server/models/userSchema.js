// Import the Mongoose library
const mongoose = require('mongoose');

// Define the user schema
let userSchema = new mongoose.Schema({
    // Field for username
    username:{
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    // Field for user email
    email:{
        type: String,
        required: [true, 'User email is required'],
        unique: true,
    },
    //Field for user date of birth
    dateOfBirth: {
        type: Date,
        required: [true, 'date of birth is required'],
    },
    //Optional field for admin status
    admin: {
        type: Boolean,
        required: false,
    },
    //Field for user password
    password: {
        type: String,
        required: [true, 'User password is required'],
    }
},{timestamps: true});

// Export the users model based on the userSchema
module.exports = mongoose.model('User', userSchema);