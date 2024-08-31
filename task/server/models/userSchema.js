// Import the Mongoose library
const mongoose = require('mongoose');

// Define the user schema
let userSchema = new mongoose.Schema({
    // Field for username
    username:{
        type: String,//Indicate data type as a string
        /* Username is required; if not provided, an
         error message is displayed*/
        required: [true, 'Username is required'],
        unique: true,
    },
    // Field for user email
    email:{
        type: String,//Indicate data type as a string
        required: [true, 'User email is required'],
        unique: true,
        /* Set the email to lowercase before 
        saving it to the database*/
        set: (v) => toLowerCase(),
    },
    //Field for user date of birth
    dateOfBirth: {
        type: Date,//Indicate data type as date
        /*Date of birth is required; if not provided, 
        an error message is displayed*/
        required: [true, 'date of birth is required'],
    },
    //Optional field for admin status
    admin: {
        type: Boolean,//Indicate data type as a string
        /* This field is optional, so no 
        requirement is enforced*/
        required: false,
    },
    //Field for user password
    password: {
        type: String,//Indicate data type as a string
        // Password is required; if not provided, 
        //an error message is displayed
        required: [true, 'User password is required'],
        unique: true,
    }
}, { timestamps: true });
/* Add timestamps for each document, 
including 'createdAt' and 'updatedAt' fields*/

// Export the users model based on the userSchema
module.exports = mongoose.model('User', userSchema);
