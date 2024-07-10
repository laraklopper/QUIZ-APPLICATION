import React, {useEffect} from 'react'

//Timer function component
export default function Timer({timeLeft, setTimeLeft, setQuizStarted, setLastQuestion}) {



    useEffect(() => {
        if (timeLeft === 0) {
            setQuizStarted(false);
            setLastQuestion(true)
            return
        }

        
        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

        return () => clearTimeout(timerId)
    }, [timeLeft, setTimeLeft, setQuizStarted, setLastQuestion])

    //=========JSX RENDERING=============
 

  return (
    <div>
        <div>TIMER: {timeLeft}</div>
    </div>
  )
}
