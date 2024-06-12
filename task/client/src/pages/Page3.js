import React, { useState, useEffect } from 'react'
import Header from '../components/Header'

//Page3 function component
export default function Page3() {
  //=========STATE VARIABLES===========
  const [quizzes, setQuizzes] = useState([])
  const [quizName, setQuizName] = useState('')
  // const [username, setUsername] = useState('')//userData.username
  const [questions, setQuestions] = useState([
    { questionText: '', correctAnswer: '', options: ['', '', '', ''] }
  ]);
  // const [error, setError] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);

  //========JSX RENDERING===================

  useEffect(() => {
    // Fetch all quizzes on component mount
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://localhost:3001/users/quizzes',);
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    fetchQuizzes();
  }, []);


  return (
    <>
    {/* Header */}
    <Header heading='ADD QUIZ'/>
    {/* section1 */}
    
    </>
  )
}
