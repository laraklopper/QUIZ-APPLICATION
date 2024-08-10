const mongoose = require('mongoose');

// Define the user schema
let userSchema = new mongoose.Schema({   
    username:{
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    email:{
        type: String,
        required: [true, 'User email is required'],
        unique: true,
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'date of birth is required'],
    },
    admin: {
        type: Boolean,
        required: false,
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
    }
},{timestamps: true});

// Export the users model based on the userSchema
module.exports = mongoose.model('User', userSchema);
