const request = require('supertest'); //Require Supertest fot HTTP requests
const app = require('../app');//Import the main Express Application
// const User = require('../models/userSchema');//Import the Mock User schema
global.fetch = jest.fn()

describe('GET /findUsers', () => { 
    it('it should return the users and match the snapshot', async () => {
        const response =await request(app)
        .get('/users/findUsers')

        expect(response.status).toBe(200)

        // Match the response with the stored snapshot
        expect(response.body).toMatchSnapshot();
    })
 })
