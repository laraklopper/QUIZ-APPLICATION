const QUIZ_URL =  'http://localhost:3001/quiz';


// Function to fetch all quizzes
export const fetchQuizzes = async (token) => {
  const response = await fetch(`${QUIZ_URL}/findQuizzes`, {
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

  return response.json();
};

//Function to fetch a single quiz
export const fetchQuiz = async (quizId, token) => {
  const response = await fetch(`${QUIZ_URL}/quizId/${quizId}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quiz');
  }

  return response.json();
};

//Function to add a new quiz
export const addNewQuiz = async (quizName, questions, token) => {
  const quiz = { name: quizName, questions };

  const response = await fetch(`${QUIZ_URL}/addQuiz`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(quiz)
  });

  if (!response.ok) {
    throw new Error('There was an error creating the quiz');
  }

  return response.json();
};

// Function to edit a quiz
export const editQuiz = async (quizId, newQuizName, editQuizIndex, token) => {
  const response = await fetch(`${QUIZ_URL}/editQuiz/${quizId}`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      quizName: newQuizName,
      questions: editQuizIndex
    })
  });

  if (!response.ok) {
    throw new Error('Error editing quiz');
  }

  return response.json();
};

// Function to delete a quiz
export const deleteQuiz = async (quizId, token) => {
  const response = await fetch(`${QUIZ_URL}/deleteQuiz/${quizId}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error('Error deleting quiz');
  }
};
