import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

/*
Unit tests for the fetchUser and fetchCurrentUser API request functions
*/
// Mock the global fetch API to control its behaviour in tests
global.fetch = jest.fn()

describe('fetchUsers and fetchCurrentUser', () => {
    //Each test checks different aspects of the App component
    // Reset mocks and clear localStorage before each test
    beforeEach(() => {
        fetch.mockClear();// Clears any previous mock calls
        localStorage.clear();// Resets localStorage for isolation
    })

    // Test case 1: Ensure fetchUsers fetches data and updates state correctly when logged in
    test('fetchUsers: should fetch users and update state when logged in is true', async () => {
        // Set up mock token and logged-in status in localStorage
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('loggedIn', 'true');

        // Mock a successful fetch response for the list of users
        fetch.mockResolvedValueOnce({
            ok: true,// Indicates the fetch call succeeded
            json: async () => [
                { username: 'user1', email: 'user1@example.com' },
                { username: 'user2', email: 'user2@example.com' },
            ],
        });

        render(<App />);// Render the main application component

        // Wait for 'user1' to appear in the DOM, indicating successful state update
        const user = await screen.findByText('user1');
        expect(user).toBeInTheDocument();// Expect that 'user1' toBe rendered


        // Verify that fetch was called with the correct endpoint and headers
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/users/findUsers', {
            method: 'GET', // HTTP method
            mode: 'cors', // Enable cross-origin requests
            headers: {
                'Content-Type': 'application/json', // Specify JSON content type
                'Authorization': `Bearer mockToken`, // Include authorization token
            },
        });
    })

    // Test case 2: Ensure fetchCurrentUser fetches and updates state correctly
    test('fetchCurrentUser: should fetch current user and update state', async () => {

        // Set up mock token and logged-in status in localStorage
        localStorage.setItem('token', 'mockToken');
        localStorage.setItem('loggedIn', 'true');
        // Mock a successful fetch response for the current user's data

        fetch.mockResolvedValueOnce({
            ok: true, // Indicates the fetch call succeeded

            json: async () => ({ username: 'currentUser', email: 'currentUser@example.com' }),
        });

        render(<App />);// Render the main application component

        // Wait for 'currentUser' to appear in the DOM, indicating successful state update
        const currentUser = await screen.findByText('currentUser');
        expect(currentUser).toBeInTheDocument();// Expect that the 'currentUser' is rendered

        // Verify that fetch was called with the correct endpoint and headers
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/users/userId', {
            method: 'GET', // HTTP method
            mode: 'cors', // Enable cross-origin requests
            headers: {
                'Content-Type': 'application/json', // Specify JSON content type
                'Authorization': `Bearer mockToken`, // Include authorization token
            },
        });
    })

    // Test case 3: Ensure fetchUsers handles error state when fetch fails
    test('fetchUsers: should handle error state when fetch fails', async () => {
        localStorage.setItem('loggedIn', 'true'); // Set logged-in status in localStorage

        // Mock a failed fetch response
        fetch.mockResolvedValueOnce({
            ok: false, // Indicates the fetch call failed
            statusText: 'Internal Server Error', // Error message
        });

        render(<App />);// Render the main application component


        // Wait for the error message to appear in the DOM
        const errorElement = await screen.findByText('Error fetching users');
        expect(errorElement).toBeInTheDocument(); // Expect that the error message is displayed

    })

    // Test case 4: Ensure fetchCurrentUser handles error state when fetch fails
    test('fetchCurrentUser: should handle error state when fetch fails', async () => {
        localStorage.setItem('loggedIn', 'true');// Set logged-in status in localStorage

        // Mock a failed fetch response
        fetch.mockResolvedValueOnce({
            ok: false, // Indicates the fetch call failed
            statusText: 'Unauthorized', // Error message
        });

        render(<App />);//Render the main application component

        // Wait for the error message to appear in the DOM
        const errorElement = await screen.findByText('Error fetching current user');
        expect(errorElement).toBeInTheDocument();//Expect an error message to be displayed
    })
})

