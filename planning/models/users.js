const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: false,
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });/*The timestamps option tells Mongoose to assign `createdAt` and `updatedAt` fields to your schema.
The type assigned is Date.*/

module.exports = mongoose.model('users', userSchema);

