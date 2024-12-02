const crypto = require('crypto'); // Import the 'crypto' module to generate secure random values
const fs = require('fs');         // Import the 'fs' module to perform file operations
const path = require('path');     // Import the 'path' module to handle file paths

/*Generate a 64-byte random value and convert it to a 
hexadecimal string for use as a secret key*/
let jwtKey = crypto.randomBytes(64).toString('hex');

console.log(jwtKey);// Log the generated key to the console for verification/debugging purposes

const filePath = path.join(__dirname, '../.env');// Define the path to the .env file.

const jwtSecretLine = `JWT_SECRET_KEY=${jwtKey}\n`;// Create the line to be added to the .env file, defining the JWT secret key

// Append the secret key to the .env file
fs.appendFile(filePath, jwtSecretLine, (err) => {
    if (err) {
        // Log an error message if the operation fails for debugging purposes
        console.error('Error writing to .env file:', err);
    } else {
        // Log a success message if the operation completes successfully
        console.log('JWT_SECRET added to .env file');
    }
});
