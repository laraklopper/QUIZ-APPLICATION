import React /*,{ useState }*/ from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Quiz({selectedQuiz, questionIndex, handleAnswer}) {
    //============STATE VARIABLES===============
  
  const [play, setPlay] = useState(false);// State to track whether the game is being played or not
  const [answers, setAnswers] = useState([]);   //store the answers from the database as an array
  const [timerEnabled, setTimerEnabled] = useState(true);  // Indicates if the timer is enabled
  const [score, setScore] = useState(0);  //Track the user score => save user score to the database after the quiz is complete
  const [currentQuestion, setCurrentQuestion] = useState(0);   // Tracks the current question index
  const [lastQuestion, setLastQuestion] = useState(false);     // Indicates if the current question is the last one
  const [timer, setTimer] = useState(10);     // Sets the countdown timer for each question

    //==============================================
       useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch ('http://localhost:3001/users/fetchQuiz', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content/type': 'application/json',
            'Authorization': token,
          }        
        })

        if (response.ok) {
          const quizData = await response.json();// Parse JSON response
          setQuizList(quizData);
        } else {
          throw new Error('Failed to fetch Quizzes')// Throw error if response is not ok
        }
        
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    }
    fetchQuizzes()
  },[])

//===========USE EFFECT HOOK TO DISPLAY TIMER OPTION============
         useEffect(() => {
        if
            (startQuiz) {
            const interval = setInterval(() => {
                setTimer(prevTimer => {
                    if
                        (prevTimer > 0) {
                        return prevTimer - 1;
                    }
                    else {
                        setCurrentQuestion(prevQuestion => prevQuestion + 1);
                        // Reset timer for the next question
                        return 10;
                    }
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentQuestion, startQuiz]);
    //=========REQUESTS============
    
    // ===========EVENT LISTENERS===========

    /*
    => handleNextQuestion
    => handleTimerChange
    => handleReset
    => handleNextQuestion
    => generateAnswers
    => startQuiz
    => playGame
    => chooseQuiz
    => handleGameStatus
    */


// Handles moving to the next question
const handleNextQuestion = () => {
if (currentQuestion + 2 === questions.length) {
  setLastQuestion(true); // Set lastQuestion to true if the next question is the last one
}
  setCurrentQuestion(prevQuestion => prevQuestion + 1); // Move to the next question
  if(setTimerEnabled(true)){// Reset the timer to 10 seconds if the timer is enabled
  setTimer(10); 
  }
};


  /*
  // Handles the change in the timer option
   const handleTimerChange = (event) => {
     setTimerEnabled(event.target.checked); // Update timerEnabled based on the checkbox state
   };
   */

  /*
  //Function to reset answers
    const handleReset = () => {
     //Logic for reset button
   };
  */

  
  /*
    const generateAnswers = () => {
        return 'anwers'.split('').map((answer) => (//Fetch answers from database
            <Button
                variant='primary'
                className='answerBtn'
                key={answer}
                value={answer}
                onClick={handleGuess}
            >
                {letter}
            </Button>
        ));
    };
    //randomly generate answers fetched from database
    const generateAnswers = () => {
      return answers.split('').map(() => (//Fetch answers from database
        <Button
        
    
       answers[Math.floor(Math.random() * answers.length)]
    }
      >
          {answer} map answers
    => output format
     <Row>
          <Col xs={6}>
          </Col>
          <Col xs={6}>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
          </Col>
          <Col xs={6}>
          </Col>
        </Row> 
        </Button>
      ));
    // };
     */
  /*
  /*
     // Function to restart the game
    const choosequiz = () => {
   //logic;
    };
  */
  /*   const gameStatus = () => {
        if () {//answer is correct 
          //logic to style button according
        } else if () {//answer is incorrect
          //logic to style button accordingly
        }
    };
  */

    //=======JSX RENDERING==========
  return (
    <div>
      <Row>
        <Col>
        <h3 className='h3'>{selec} TYPE</h3>
        </Col>
      </Row>
      <div>
        <form>
          <Row>
            <Col>
            {/* TIMER */}
            </Col>
            <Col >
        {/* QUESTION */}
           </Col>
            <Col>
            </Col>
          </Row>
          {/* map through questions */}
          <Row>
            <Col xs={6} md={4}>
              xs=6 md=4
            </Col>
            <Col xs={6} md={4}>
              xs=6 md=4
            </Col>
            <Col xs={6} md={4}>
              xs=6 md=4
            </Col>
          </Row>
        </form>
       
          </div>
        
    

    </div>
  )
}
