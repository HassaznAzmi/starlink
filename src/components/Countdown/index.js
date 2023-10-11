import React, { useEffect, useState } from "react";
import T from "prop-types";

import "./index.css";

const Clock = ({ deadline }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const getTimeUntil = (deadline) => {
    const time = Date.parse(deadline) - Date.parse(new Date());

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTimeUntil(deadline), 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="countdownContainer">
      <div className="countdownColumn">
        <span className="timeCountdown">{days}</span>
        <span>Days</span>
      </div>
      <div className="countdownColumn">
        <span className="timeCountdown">{hours}</span>
        <span>Hours</span>
      </div>
      <div className="countdownColumn">
        <span className="timeCountdown">{minutes}</span>
        <span>Minutes</span>
      </div>
      <div className="countdownColumn">
        <span className="timeCountdown">{seconds}</span>
        <span>Seconds</span>
      </div>
    </div>
  );
};

Clock.propTypes = {
  deadline: T.string,
};

export default Clock;
