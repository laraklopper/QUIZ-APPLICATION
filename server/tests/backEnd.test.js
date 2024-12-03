const request = require('supertest'); // Import supertest to simulate HTTP requests
const app = require('../app'); // Import the Express app
const mongoose = require('mongoose'); // Import mongoose to work with MongoDB IDs
const Scores = require('../models/scoreSchema'); // Mocked Score schema
const User = require('../models/userSchema'); // Mocked User schema
const Quiz = require('../models/quizModel'); // Mocked Quiz schema
jest.mock('jsonwebtoken'); // Mock the JWT library

require('dotenv').config()

// Mocking database models to isolate tests from the actual database
jest.mock('../models/scoreSchema');
jest.mock('../models/quizModel');
jest.mock('../models/userSchema');

// Mock middleware for token validation
jest.mock('../routes/middleware', () =>
    jest.fn((req, res, next) => {
        if (req.headers.authorization === 'Bearer fakeToken') {
            req.user = { userId: '12345' };
            next();
        } else {
            res.status(401).json({ message: 'Invalid or missing token' });
        }
    })
);

// Function to avoid code repetition for authentication header
const mockAuthHeader = { Authorization: 'Bearer fakeToken' };

// Function for making requests
const makeRequest = (method, url, body = {}) =>
    request(app)[method](url)
        .set(mockAuthHeader)
        .send(body);

// Unit tests for the GET /userId endpoint
describe('GET /userId', () => {
    let mockUser;

    beforeEach(() => {
        mockUser = { _id: '12345', username: 'user123', email: 'user123@test.com' };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks to ensure clean state
    });

    //Test case 1
    it('should return user details if valid token is provided', async () => {
        User.findById.mockResolvedValue(mockUser);

        const res = await makeRequest('get', '/userId');

        expect(res.status).toBe(200);
        expect(res.body.username).toBe(mockUser.username);
        expect(res.body.email).toBe(mockUser.email);
        expect(res.body.password).toBeUndefined();
    });
    //Test case2
    it('should return 404 if user not found', async () => {
        User.findById.mockResolvedValue(null);

        const res = await makeRequest('get', '/userId');

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User Not Found');
    });
    //Test case3

    it('should return 500 if there is an error fetching the user', async () => {
        User.findById.mockRejectedValue(new Error('Database error'));

        const res = await makeRequest('get', '/userId');

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Internal Server Error');
    });
});

// Unit tests for the GET /findUsers endpoint
describe('GET /findUsers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    //Test case 1
    it('should return a list of users if no query is provided', async () => {
        const mockUsers = [
            { _id: '12345', username: 'user123', email: 'user123@test.com' },
            { _id: '67890', username: 'user456', email: 'user456@test.com' },
        ];
        User.find.mockResolvedValue(mockUsers);

        const res = await makeRequest('get', '/findUsers');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0].username).toBe(mockUsers[0].username);
    });
    //Test case 2
    it('should return 500 if there is an error fetching users', async () => {
        User.find.mockRejectedValue(new Error('Database error'));

        const res = await makeRequest('get', '/findUsers');

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});

// Unit tests for the GET /findQuiz/:id endpoint
describe('GET /findQuiz/:id', () => {
    const validId = mongoose.Types.ObjectId();
    const invalidId = 'invalidId';
    //Test case 1
    it('should return 400 if quiz ID is invalid', async () => {
        const res = await makeRequest('get', `/findQuiz/${invalidId}`);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid or missing quiz ID');
    });
    //Test case 2
    it('should return 404 if quiz not found', async () => {
        Quiz.findById.mockResolvedValue(null);

        const res = await makeRequest('get', `/findQuiz/${validId}`);

        expect(Quiz.findById).toHaveBeenCalledWith(validId);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Quiz not found');
    });
    //Test case 3
    it('should return the quiz object if found', async () => {
        const mockQuiz = { _id: validId, name: 'Test Quiz' };
        Quiz.findById.mockResolvedValue(mockQuiz);

        const res = await makeRequest('get', `/findQuiz/${validId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockQuiz);
    });
    //Test case 4
    it('should return 500 if there is a server error', async () => {
        Quiz.findById.mockRejectedValue(new Error('Database error'));

        const res = await makeRequest('get', `/findQuiz/${validId}`);

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});

// Unit tests for the GET /findQuizzes endpoint
describe('GET /findQuizzes', () => {
    const mockQuizzes = [
        { _id: mongoose.Types.ObjectId(), name: 'Quiz 1' },
        { _id: mongoose.Types.ObjectId(), name: 'Quiz 2' },
    ];

    it('should return 200 and the list of quizzes', async () => {
        Quiz.find.mockResolvedValue(mockQuizzes);

        const res = await makeRequest('get', '/quiz/findQuizzes');

        expect(Quiz.find).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual(mockQuizzes);
    });

    it('should return 500 if there is a server error', async () => {
        Quiz.find.mockRejectedValue(new Error('Database error'));

        const res = await makeRequest('get', '/quiz/findQuizzes');

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});

// Unit tests for the GET /findScores endpoint
describe('GET /findScores', () => {
    afterEach(() => jest.clearAllMocks());

    //Test case 1
    it('should return all scores', async () => {
        const mockScores = [
            { username: 'user1', name: 'Quiz1', score: 85 },
            { username: 'user2', name: 'Quiz2', score: 90 },
        ];
        Scores.find.mockResolvedValue(mockScores);

        const res = await makeRequest('get', '/api/scores/findScores');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockScores);
        expect(Scores.find).toHaveBeenCalledTimes(1);
    });

    //Test case 2:
    it('should handle database errors gracefully', async () => {
        Scores.find.mockRejectedValue(new Error('Database error'));

        const res = await makeRequest('get', '/api/scores/findScores');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('message', 'Error fetching user scores');
    });
});
