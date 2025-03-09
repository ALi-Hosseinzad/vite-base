import React, { useEffect, useState } from "react";
import { useCountdown } from "helpers/useCountdown";
import Classes from "components/timer/Timer.module.scss";
import Dictionary from "helpers/Dictionary";
import ButtonComponent from "components/button/ButtonComponent";

const ExpiredNotice = ({ onClick }) => {
  const handleClick = () => {
    try {
      onClick();
    } catch (error) {}
  };
  return (
    <div className={Classes["expired-notice"]}>
      <span>{Dictionary.notReceived}</span>
      <ButtonComponent type="text" onClick={handleClick}>
        {Dictionary.resend}
      </ButtonComponent>
    </div>
  );
};
const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div className={isDanger ? Classes["countdown-danger"] : Classes["countdown"]}>
      <span>{String(value).padStart(2, 0)}</span>
      {type && <span>{type}</span>}
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds, type }) => {
  return (
    <div className={Classes["show-counter"]}>
      {days > 0 && (
        <>
          <DateTimeDisplay value={days} type={type?.day && "Days"} isDanger={days <= 3} />
          <span>:</span>
        </>
      )}
      {hours > 0 && (
        <>
          <DateTimeDisplay value={hours} type={type?.hour && "Hours"} isDanger={false} />
          <span>:</span>
        </>
      )}
      <DateTimeDisplay value={minutes} type={type?.min && "Mins"} isDanger={seconds <= 10} />
      <span>:</span>
      <DateTimeDisplay value={seconds} type={type?.second && "Seconds"} isDanger={seconds <= 10} />
      <span className={Classes["show-counter-text"]}>{Dictionary.restOfTime}</span>
    </div>
  );
};

const CountdownTimer = ({ targetDate, type, onClick }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice onClick={onClick} />;
  } else {
    return <ShowCounter days={days} hours={hours} minutes={minutes} seconds={seconds} type={type} />;
  }
};

export default CountdownTimer;
