import React, {useEffect, useRef} from 'react'
import Button from 'react-bootstrap/Button';

//Timer function component
export default function Timer({timeLeft, setTimeLeft}) {

    let intervalRef = useRef(null);



    //=========EVENTS==============
    const startTimer = () =>{
        if (intervalRef.current !== null ) return;

        intervalRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000)
    }

    useEffect(() => {
        return () => clearInterval(intervalRef.current)
    }, [])

    //=========JSX RENDERING=============
 

  return (
    <div>
        <div>TIME LEFT: {timeLeft}</div>
        <Button variant='primary' onClick={startTimer}>
            COUNT DOWN
        </Button>
    </div>
  )
}
