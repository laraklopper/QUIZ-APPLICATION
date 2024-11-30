// Import necessary modules and components
import React from 'react';// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Form from 'react-bootstrap/Form';// Import Col component from react-bootstrap
import FormHeaders from '../components/FormHeaders'; // Import form heading component

// SelectQuizForm function component
export default function SelectQuizForm(//Export the default SelectQuizForm function component
    {// PROPS PASSED FROM PARENT COMPONENT
    selectedQuizId,
    quizList,
    setSelectedQuizId
    }
) {

    //============EVENT LISTENERS===============
    // Function to handle quiz selection
    const handleSelectQuiz = (event) => {
        // Update selected quiz ID
        setSelectedQuizId(event.target.value);
    };

    //============JSX RENDERING==============
    
    return (
        <div id='selectQuizForm'>
            {/* Heading for quiz selection */}
            {/* Render the FormHeaders component with 
            'SELECT QUIZ' as the  Formheading */}
            <FormHeaders formHeading='SELECT QUIZ' />
            <Row className='selectQuizRow'>
                <Col md={4}></Col>
                <Col xs={6} md={4} id='selectQuizCol'>
                {/* Label for the quizList dropdown */}
                    <label id='selectQuizLabel'>
                        <p className='labelText'>SELECT: </p>
                    </label>
                    {/* Form to select a quiz */}
                    {/* Dropdown (bootstrap select element) for selecting a quiz */}
                    <Form.Select
                        id='quizSelect'
                        value={selectedQuizId} // Bind to the selected quiz ID state
                        onChange={handleSelectQuiz} // Call the handleSelectQuiz function
                    >
                        {/* Default option prompting the user to select a quiz */}
                        <option value=''>Select a quiz</option>
                        {/* Map over the quizList array to create an option for each quiz */}
                        {quizList && quizList.length > 0 && quizList.map((quiz) => (
                            <option key={quiz._id} value={quiz._id} id='quizOption'>
                                {/* Display quiz name */}
                                {quiz.name}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={6} md={4}></Col>
            </Row>
        </div>
    );
}
