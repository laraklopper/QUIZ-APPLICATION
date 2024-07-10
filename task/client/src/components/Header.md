# HEADER
To use a single header component that adjusts based on whether the user is logged in or not, you can pass a `loggedIn` prop to the header component. This prop will determine which navigation links to display. Here's how you can modify your header component and App.js to accommodate this.

### Step 1: Create a Single Header Component

Create a single header component that takes `loggedIn` and `heading` as props and adjusts the navigation links accordingly.

```jsx
// Header.jsx
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

export default function Header({ loggedIn, heading }) {
  return (
    <header className='header'>
      <Row className='headingRow'>
        <Col className='headingCol'>
          <h1 className='h1'>{heading}</h1>
        </Col>
      </Row>
      <Row className='navRow'>
        <Col className='navCol'>
          <nav className='navigation'>
            <ul className='navbar'>
              {loggedIn ? (
                <>
                  <li className='linkItem'>
                    <Link className='refLink' to='/'>
                      <p className='linkText'>HOME</p>
                    </Link>
                  </li>
                  <li className='linkItem'>
                    <Link className='refLink' to='/page2'>
                      <p className='linkText'>GAME</p>
                    </Link>
                  </li>
                  <li className='linkItem'>
                    <Link className='refLink' to='/page3'>
                      <p className='linkText'>ADD QUESTIONS</p>
                    </Link>
                  </li>
                  <li className='linkItem'>
                    <Link className='refLink' to='/page4'>
                      <p className='linkText'>USER ACCOUNT</p>
                    </Link>
                  </li>
                  <li className='linkItem'>
                    <button className='refLink' onClick={logout}>
                      <p className='linkText'>LOGOUT</p>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className='linkItem'>
                    <Link className='refLink' to='/'>
                      <p className='linkText'>LOGIN</p>
                    </Link>
                  </li>
                  <li className='linkItem'>
                    <Link className='refLink' to='/reg'>
                      <p className='linkText'>REGISTRATION</p>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </Col>
      </Row>
    </header>
  );
}
```

### Step 2: Update App.js to Use the Single Header Component

Modify `App.js` to use the `Header` component and pass the necessary props.

```jsx
// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Header from './components/Header';

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const [newUserData, setNewUserData] = useState({
    newUsername: '',
    newEmail: '',
    newDateOfBirth: '',
    newAdmin: false,
    newPassword: ''
  });
  const [quizList, setQuizList] = useState([]);
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', correctAnswer: '', options: ['', '', '', ''] }
  ]);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !loggedIn) return;

        const response = await fetch('http://localhost:3001/users/findUsers', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const fetchedUsers = await response.json();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users', error.message);
        setError('Error fetching users');
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:3001/users/userId', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch current user');
        }

        const fetchedCurrentUser = await response.json();
        setCurrentUser(fetchedCurrentUser);
      } catch (error) {
        console.error('Error fetching current user', error.message);
        setError('Error fetching current user');
      }
    };

    if (loggedIn) {
      fetchUsers();
      fetchCurrentUser();
    }
  }, [loggedIn]);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/quiz/findQuizzes', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      const quizData = await response.json();
      setQuizList(quizData);
      
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Error fetching quizzes');
    }
  };

  const submitLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('username', userData.username);
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('token', data.token);
        setLoggedIn(true);
        setError(null);
        setUserData({
          username: '',
          password: '',
        });
      } else {
        throw new Error('Username or password are incorrect');
      }
    } catch (error) {
      setError(`Login Failed: ${error.message}`);
      console.log(`Login Failed: ${error.message}`);
      setLoggedIn(false);
      alert('LOGIN FAILED');
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUserData.newUsername,
          email: newUserData.newEmail,
          dateOfBirth: newUserData.newDateOfBirth,
          admin: newUserData.newAdmin,
          password: newUserData.newPassword
        })
      });

      if (response.ok) {
        setNewUserData({
          newUsername: '',
          newEmail: '',
          newDateOfBirth: '',
          newAdmin: false,
          newPassword: ''
        });
        alert('New User successfully registered')
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error adding user');
      }
    } catch (error) {
      setError(`Error adding new user: ${error.message}`);
      console.error(`Error adding new user: ${error.message}`);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedIn');
    setLoggedIn(false);
    setError('');
    setUserData({ username: '', password: '' });
  };

  return (
    <BrowserRouter>
      <Container>
        <Header loggedIn={loggedIn} heading={loggedIn ? `Welcome ${currentUser?.username}` : 'Please Log In'} />
        <Routes>
          {loggedIn ? (
            <>
              <Route path='/' element={
                <Page1
                  logout={logout}
                  error={error}
                  currentUser={currentUser}
                />}
              />
              <Route path='/page2' element={
                <Page2
                  logout={logout}
                  fetchQuizzes={fetchQuizzes}
                  quizList={quizList}
                  quizName={quizName}
                  setQuizName={setQuiz

Name}
                  questions={questions}
                  setQuestions={setQuestions}
                />}
              />
              <Route path='/page3' element={
                <Page3
                  quizList={quizList}
                  logout={logout}
                  setError={setError}
                  setQuizList={setQuizList}
                  fetchQuizzes={fetchQuizzes}
                  quizName={quizName}
                  setQuizName={setQuizName}
                  questions={questions}
                  setQuestions={setQuestions}
                />}
              />
              <Route path='/page4' element={
                <Page4
                  setError={setError}
                  logout={logout}
                  currentUser={currentUser}
                  setUsers={setUsers}
                  setLoggedIn={setLoggedIn}
                  users={users}
                />}
              />
            </>
          ) : (
            <>
              <Route exact path='/' element={
                <Login
                  submitLogin={submitLogin}
                  userData={userData}
                  setUserData={setUserData}
                />}
              />
              <Route path='/reg' element={
                <Registration
                  addUser={addUser}
                  newUserData={newUserData}
                  setNewUserData={setNewUserData}
                />}
              />
            </>
          )}
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
```

### Summary

By using a single header component and passing the `loggedIn` prop, you can conditionally render the appropriate navigation links. This approach makes the code cleaner and easier to maintain.
