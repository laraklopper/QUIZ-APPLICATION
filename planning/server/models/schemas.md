# MODELS

## userSchema

```javascript
//userSchema.js
const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
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
        unique: true
    }
},
{ timestamps: true }
);

module.exports = mongoose.model('users', userSchema);
```

## quiz model

```javascript
//quizModel
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    questions: {
        type: [
            {
                questionText: {
                    type: String,
                    required: true,
                },
                correctAnswer: {
                    type: String,
                    required: true,
                },
                options: {
                    type: [String],
                    required: true,
                    validate: [arrayLimit, '{PATH} must have exactly 3 options']
                }
            }
        ],
        required: true,
        validate: [arrayLimit5, '{PATH} must have exactly 5 questions']
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length === 3;
}

function arrayLimit5(val) {
    return val.length === 5;
}

module.exports = mongoose.model('quiz', quizSchema);
```

## score schema
```javascript
//scoreSchema.js
const mongoose = require('mongoose');

const scoreSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    quizName: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        default: 0,
        required: true,
    },
    attempts: {
        type: Number,
        default: 0,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('scores', scoreSchema);
```
