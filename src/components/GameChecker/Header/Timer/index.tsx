import React, { useState, useEffect } from 'react';

interface TimerProps {
  isGameEnded?: boolean;
}

const Timer = ({ isGameEnded }: TimerProps) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timerId: any;
    // Need an extra timer reset when the game is reset
    if (!isGameEnded) {
      timerId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerId);
      setTime(0);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [isGameEnded]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <div>
      Time: <b>{formattedTime}</b>
    </div>
  );
};

export default Timer;
