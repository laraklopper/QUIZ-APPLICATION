import React, { useCallback, useEffect, useRef, useState } from 'react'


export default function Timer() {
    const [timer, setTimer] = useState("00:00:00")
    const Ref = useRef(null);

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total/1000) % 60)
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor( (total / 1000 / 60 / 60) % 24);
        return{
          total,
          hours, 
          minutes, seconds  
        }
    }
    
    const startTimer = useCallback((e) => {
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                ":" +
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    },[]);

    const clearTimer= useCallback( (e) => {
        setTimer("00:00:10");
        if (Ref.current) clearInterval(Ref.current)
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;   
    },[startTimer])

    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 10);
        return deadline
    }

    useEffect(() => {
        clearTimer(getDeadTime())
    },[clearTimer])

    const resetTimer = () => {
        clearTimer(getDeadTime())
    }
    //==============================
  return (
    <div>
        <h2>{timer}</h2>
        <button onClick={resetTimer}>RESET TIMER</button>
        </div>
  )
}
