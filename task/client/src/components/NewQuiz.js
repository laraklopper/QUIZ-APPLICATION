import React from 'react';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//NewQuiz function component
export default function NewQuiz(
    {
        newQuizName, 
        setNewQuizName, 
        newQuestions, 
        setNewQuestions, 
        newQuizIndex, 
        setNewQuizIndex, 
        addNewQuiz
    }) {
    

    //==========EVENT VARIABLES================
    const handleAddQuestion = () => {
        setNewQuestions([...newQuestions, newQuizIndex]);
        setNewQuizIndex({
            questionText: '',
            correctAnswer: '',
            options: ['', '', '']
        });
    };

    const handleDeleteQuestion = (index) => {
        setNewQuestions(newQuestions.filter((_, i) => i !== index));
    };


// JSX Rendering
    return (
        <div>
            <div>
                <Row>
                    <Col>
                        <h2 className='h2'>ADD QUIZ</h2>
                    </Col>
                </Row>
            </div>
            <form>
                <Row>
                    <Col xs={6} md={4}>
                        <label>
                            <p className='labelText'>QUIZ NAME:</p>
                            <input
                                type='text'
                                name='newQuizName'
                                value={newQuizName}
                                onChange={(e) => setNewQuizName(e.target.value)}
                                autoComplete='off'
                                placeholder='QUIZ NAME'
                                className='quizInput'
                                required
                            />
                        </label>
                    </Col>
                    <Col xs={12} md={8}></Col>
                </Row>
                {/* Input for a new question */}
                <div>
                    <Row>
                        <Col>
                            <h3 className='h3'>ADD QUESTION</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            {/* Question Input */}
                            <label className='addQuizLabel'>
                                <p className='labelText'>QUESTION</p>
                                <input
                                    type="text"
                                    name='newQuestionText'
                                    value={newQuizIndex.newQuestionText}
                                    onChange={(e) => setNewQuizIndex(
                                        { ...newQuizIndex, newQuestionText: e.target.value })}
                                    autoComplete='off'
                                    placeholder='QUESTION'
                                    className='quizInput'
                                    required
                                />
                            </label>
                        </Col>
                        <Col xs={6}>
                            {/* Correct question input */}
                            <label className='addQuizLabel'>
                                <p className='labelText'>CORRECT ANSWER:</p>
                                <input
                                    type='text'
                                    name="newCorrectAnswer"
                                    value={newQuizIndex.correctAnswer}
                                    onChange={(e) => setNewQuizIndex({ ...newQuizIndex, newCorrectAnswer: e.target.value })}
                                    autoComplete='off'
                                    className='quizInput'
                                    required
                                />
                            </label>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            {/* Alternative input */}
                            <label className='addQuizLabel'>
                                <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
                                <input
                                    type='text'
                                    name="newOptions[0]"
                                    value={newQuizIndex.newOptions[0]}
                                    onChange={(e) => setNewQuizIndex({
                                        ...newQuizIndex,
                                        options: [e.target.value, newQuizIndex.options[1], newQuizIndex.options[2]]
                                    })}
                                    className='quizInput'
                                    required
                                />
                            </label>
                        </Col>
                        <Col xs={6}>
                            {/* Alternative input */}
                            <label className='addQuizLabel'>
                                <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
                                <input
                                    type='text'
                                    name='newOptions[1]'
                                    autoComplete='off'
                                    value={newQuizIndex.newOptions[1]}
                                    onChange={(e) => setNewQuizIndex({
                                        ...newQuizIndex,
                                        options: [newQuizIndex.newOptions[0], e.target.value, newQuizIndex.newOptions[2]]
                                    })}
                                    className='quizInput'
                                    required
                                />
                            </label>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}></Col>
                        <Col xs={6}>
                            {/* Alternative input */}
                            <label className='addQuizLabel'>
                                <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
                                <input
                                    type='text'
                                    name='newOptions[2]'
                                    value={newQuizIndex.newOptions[2]}
                                    onChange={(e) => setNewQuizIndex({
                                        ...newQuizIndex,
                                        options: [newQuizIndex.newOptions[0], newQuizIndex.options[1], e.target.value]
                                    })}
                                    autoComplete='off'
                                    className='quizInput'
                                    required
                                />
                            </label>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={8}>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button variant="primary" type='button' onClick={handleAddQuestion}>ADD QUESTION</Button>
                        </Col>
                    </Row>
                </div>
            </form>
            <div>
                <h2 className='h2'>Questions</h2>
                {newQuestions.map((question, index) => (
                    <div key={index}>
                        <Row>
                            <Col>
                                <p>Question: {question.questionText}</p>
                                <p>Correct Answer: {question.correctAnswer}</p>
                                <p>Alternative Answers: {question.options.join(', ')}</p>
                                <Button variant="danger" onClick={() => handleDeleteQuestion(index)}>DELETE QUESTION</Button>
                            </Col>
                        </Row>
                    </div>
                ))}
                <button type="button" onClick={addNewQuiz}>Add Quiz</button>
            </div>
        </div>
    );
}
