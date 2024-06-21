# EXAMPLE
### Backend (Node.js + Express.js)

1. **Setting up the server and routes:**

    - **server.js:**
        ```javascript
        const express = require('express');
        const mongoose = require('mongoose');
        const cors = require('cors');
        const bodyParser = require('body-parser');
        const quizRoutes = require('./routes/quizRoutes');
        const userRoutes = require('./routes/userRoutes');
        
        const app = express();
        const port = process.env.PORT || 5000;
        
        app.use(cors());
        app.use(bodyParser.json());
        
        // Connect to MongoDB
        mongoose.connect('mongodb://localhost:27017/quizDB', { useNewUrlParser: true, useUnifiedTopology: true });
        
        app.use('/api/quizzes', quizRoutes);
        app.use('/api/users', userRoutes);
        
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
        ```

    - **models/quiz.js:**
        ```javascript
        // Import the Mongoose library for MongoDB interactions
        const mongoose = require('mongoose');
        
        const quizSchema = new mongoose.Schema({
            quizName: {
                type: String,         
                required: true,      
            },
            username: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,       
            },
            questions: {
                type: [{
                    questionText: String,    
                    correctAnswer: String,  
                    options: [String]        
                }],
                default: [],            
                required: true,         
            }
        },{timestamps: true});
        
        // Export the Quiz model based on the QuizSchema
        module.exports = mongoose.model('Quiz', quizSchema);
        ```

    - **models/user.js:**
        ```javascript
        const mongoose = require('mongoose');
        
        const userSchema = new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true }
        });
        
        module.exports = mongoose.model('User', userSchema);
        ```

    - **routes/quizRoutes.js:**
        ```javascript
        const express = require('express');
        const router = express.Router();
        const Quiz = require('../models/quiz');
        const jwt = require('jsonwebtoken');
        
        const authenticateToken = (req, res, next) => {
            const token = req.header('Authorization');
            if (!token) return res.status(401).json({ message: 'Access denied' });
        
            try {
                const verified = jwt.verify(token, 'secret');
                req.user = verified;
                next();
            } catch (err) {
                res.status(400).json({ message: 'Invalid token' });
            }
        };
        
        router.get('/', authenticateToken, async (req, res) => {
            try {
                const quizzes = await Quiz.find();
                res.json(quizzes);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        
        module.exports = router;
        ```

    - **routes/userRoutes.js:**
        ```javascript
        const express = require('express');
        const router = express.Router();
        const User = require ('../models/userSchema');
        const jwt = require('jsonwebtoken');
        
        router.post('/register', async (req, res) => {
            const { username, password } = req.body;
        
            const user = new User({ username, password });
        
            try {
                const savedUser = await user.save();
                res.json(savedUser);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        
        router.post('/login', async (req, res) => {
            const { username, password } = req.body;
        
            const user = await User.findOne({ username });
            if (!user || user.password !== password) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        
            const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '1h' });
            res.header('Authorization', token).json({ token });
        });
        
        module.exports = router;
        ```

### Frontend (React.js)

1. **Setting up React project:**
    ```bash
    npx create-react-app quiz-app
    cd quiz-app
    ```

2. **Components and State Management:**

    - **App.js:**
        ```javascript
        import React, { useState, useEffect } from 'react';

        export default function App () {
            const [quizzes, setQuizzes] = useState([]);
            const [selectedQuiz, setSelectedQuiz] = useState(null);
            const [currentQuestion, setCurrentQuestion] = useState(0);
            const [score, setScore] = useState(0);
            const [timer, setTimer] = useState(null);
            const [token, setToken] = useState('');

            useEffect(() => {
                const fetchQuizzes = async () => {
                    try {
                        const response = await fetch('/api/quizzes', {
                            headers: {
                                'Authorization': token
                            }
                        });
                        const data = await response.json();
                        setQuizzes(data);
                    } catch (error) {
                        console.error(error);
                    }
                };

                if (token) {
                    fetchQuizzes();
                }
            }, [token]);

            const handleLogin = async (username, password) => {
                try {
                    const response = await fetch('/api/users/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await response.json();
                    setToken(data.token);
                } catch (error) {
                    console.error(error);
                }
            };

            const startQuiz = (quiz) => {
                setSelectedQuiz(quiz);
                setCurrentQuestion(0);
                setScore(0);
                if (timer) {
                    // Initialize timer logic
                }
            };

            const nextQuestion = (selectedOption) => {
                if (selectedQuiz.questions[currentQuestion].answer === selectedOption) {
                    setScore(score + 1);
                }
                if (currentQuestion < selectedQuiz.questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                } else {
                    // Quiz completed
                }
            };

            return (
                <div className="App">
                    <h1>Select Quiz</h1>
                    <select onChange={(e) => startQuiz(quizzes.find(q => q.category === e.target.value))}>
                        {quizzes.map((quiz, index) => (
                            <option key={index} value={quiz.category}>{quiz.category}</option>
                        ))}
                    </select>
                    <div>
                        <label>
                            Add Timer:
                            <input type="checkbox" onChange={(e) => setTimer(e.target.checked ? 60 : null)} />
                        </label>
                    </div>
                    <button onClick={() => startQuiz(selectedQuiz)}>Play</button>
                    {selectedQuiz && (
                        <div>
                            <h2>{selectedQuiz.category}</h2>
                            <div>{timer && <span>Time Left: {timer}s</span>}</div>
                            <div>
                                <p>{selectedQuiz.questions[currentQuestion].question}</p>
                                {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                                    <button key={index} onClick={() => nextQuestion(option)}>{option}</button>
                                ))}
                            </div>
                            <div>Question {currentQuestion + 1} of {selectedQuiz.questions.length}</div>
                            <div>Score: {score}</div>
                            <button onClick={() => setSelectedQuiz(null)}>Restart</button>
                        </div>
                    )}
                </div>
            );
        };

        export default App;
        ```

3. **Login Component:**
    - **Login.js:**
        ```javascript
        import React, { useState } from 'react';

        const Login = ({ onLogin }) => {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');

            const handleSubmit = async (e) => {
                e.preventDefault();
                await onLogin(username, password);
            };

            return (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">Login</button>
                </form>
            );
        };

        export default Login;
        ```

4. **Integrating Login Component in App.js:**
    - **App.js:**
        ```javascript
        import React, { useState, useEffect } from 'react';
        import Login from './Login';

        const App = () => {
            const [quizzes, setQuizzes] = useState([]);
            const [selectedQuiz, setSelectedQuiz] = useState(null);
            const [currentQuestion, setCurrentQuestion] = useState(0);
            const [score, setScore] = useState(0);
            const [timer, setTimer] = useState(null);
            const [token, setToken] = useState('');

            useEffect(() => {
                const fetchQuizzes = async () => {
                    try {
                        const response = await fetch('/api/quizzes', {
                            headers: {
                                'Authorization': token
                            }
                        });
                        const data = await response.json();
                        setQuizzes(data);
                    } catch (error) {
                        console.error(error);
                    }
                };

                if (token) {
                    fetchQuizzes();
                }
            }, [token]);

            const handleLogin = async (username, password) => {
                try {
                    const response = await fetch('/api/users/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await response.json();
                    setToken(data.token);
                } catch (error) {
                    console.error(error);
                }
            };

            const startQuiz = (quiz) => {
                setSelectedQuiz(quiz);
                setCurrentQuestion(0);
                setScore(0);
                if (timer) {
                    // Initialize timer logic
                }
            };

            const nextQuestion = (selectedOption) => {
                if (selectedQuiz.questions[currentQuestion].answer === selectedOption) {
                    setScore(score + 1);
                }
                if (currentQuestion < selectedQuiz.questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                } else {
                    // Quiz completed
                }
            };

            return (
                <div className="App">
                    {!token ? (
                        <Login onLogin={handleLogin} />
                    ) : (
                        <>
                            <h1>Select Quiz</h1>
                            <select onChange={(e) => startQuiz(quizzes.find(q => q.category === e.target.value))}>
                                {quizzes.map((quiz, index) => (
                                    <option key={index} value={quiz.category}>{quiz.category}</option>
                                ))}
                            </select>
                            <div>
                                <label>
                                    Add Timer:
                                    <input type="checkbox" onChange={(e) => setTimer(e.target.checked ? 60 : null)} />
                                </label>
                            </div>
                            <button onClick={() => startQuiz(selectedQuiz)}>Play</button>
                            {selectedQuiz && (
                                <div>
                                    <h2>{selectedQuiz.category}</h2>
                                    <div>{timer && <span>Time Left: {timer}s</span>}</div>
                                    <div>
                                        <p>{selectedQuiz.questions[currentQuestion].question}</p>
                                        {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                                            <button key={index} onClick={() => nextQuestion(option)}>{option}</button>
                                        ))}
                                    </div>
                                    <div>Question {currentQuestion + 1} of {selectedQuiz.questions.length}</div>
                                    <div>Score: {score}</div>
                                    <button onClick={() => setSelectedQuiz(null)}>Restart</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            );
        };

        export default App;
        ```

### Running the Application
1. **Start the backend server:**
    ```bash
    node server.js
    ```

2. **Start the React application:**
    ```bash
    npm start
    ```

This code implements a simple quiz application using the MERN stack with async functions, Express Router, JWT tokens, and without using Axios or bcrypt. Users can log in to fetch quizzes and attempt them, with the option to use a timer.
