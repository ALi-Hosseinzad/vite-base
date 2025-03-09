import React, { useEffect, useRef, useState } from "react";
import Classes from "components/timePicker/TimePicker.module.scss";
import CustomIcon from "components/customIcon/CustomIcon";
import Calendar from "assets/images/icon/time.svg";
import Dictionary from "helpers/Dictionary";
import cx from "classnames";

const TimePicker = (props) => {
  const {
    leftIcon = true,
    label,
    disabled,
    placeholder,
    tabIndex,
    className,
    classNamePad,
    id,
    value,
    resetElement,
    start,
    end,
    scroll,
    show,
    showActive,
    onChange,
    showSecond,
  } = props;
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();
  let initialStateValue = showSecond ? { second: "", minute: "", hour: "" } : { minute: "", hour: "" };
  const [localState, setLocalState] = useState(initialStateValue);
  const [time, setTime] = useState("");
  const [showPad, setShowPad] = useState(false);

  const range = (start, end) => {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  };

  useEffect(() => {
    if (showSecond) {
      setLocalState({ second: "", minute: "", hour: "" });
    } else {
      setLocalState({ minute: "", hour: "" });
    }
    setShowPad(false);
    setTime("");
  }, [resetElement]);

  useEffect(() => {
    if (start === end) {
      setLocalState({ ...localState, hour: start });
    }
  }, []);

  useEffect(() => {
    if (value) {
      setTime(value);
      const arr = value.split(":");
      if (showSecond) {
        setLocalState({ second: arr[2], minute: arr[1], hour: arr[0] });
      } else {
        setLocalState({ minute: arr[1], hour: arr[0] });
      }
    }
  }, []);

  useEffect(() => {
    const topHour = Math.floor((localState.hour - start || 0) / 2);
    const topMinute = Math.floor((localState.minute - 1) / 2);
    if (localState.hour === "") {
      hourRef.current.scrollTop = scroll;
    }
    if (localState.hour !== "") {
      hourRef.current.scrollTo({
        top: topHour <= 10 ? topHour * 28 : topHour > 10 && topHour <= 20 ? topHour * 29 : topHour * 29.5,
        behavior: "smooth",
      });
      minuteRef.current.scrollTo({
        top: topMinute * 20,
        behavior: "smooth",
      });
      if (showSecond) {
        const topSecond = Math.floor((localState.second - 1) / 2);
        secondRef.current.scrollTo({
          top: topSecond <= 8 ? topSecond * 25 : topSecond * 27,
          behavior: "smooth",
        });
      }
    }
  }, [showPad]);

  useEffect(() => {
    setShowPad(show);
  }, [show]);

  const handleLocalState = (value, param) => {
    if (value < 10) {
      value = "0" + value.toString();
    } else {
      value = value.toString();
    }
    setLocalState({ ...localState, [param]: value });
  };

  const handleSubmit = () => {
    setShowPad(false);
    onChange(localState);
    if (showSecond) {
      setTime(localState.hour + ":" + localState.minute + ":" + localState.second);
    } else {
      setTime(localState.hour + ":" + localState.minute);
    }
  };

  return (
    <div className={cx(Classes["time-picker-container"], className)}>
      <span>{label}</span>
      <div className={Classes["text-box-container"]}>
        <input
          id={id}
          value={time}
          readOnly
          className={cx(Classes["time-picker-input"], { [Classes["active"]]: showPad && showActive })}
          onClick={() => setShowPad(!showPad)}
          placeholder={placeholder ? placeholder : showSecond ? Dictionary.timePicker : Dictionary.timePicker2}
        />
        {leftIcon && (
          <span className={Classes["text-box-left-icon"]}>
            <CustomIcon
              cursor={disabled ? "default" : "pointer"}
              src={Calendar}
              tabIndex={tabIndex}
              size={24}
              onKeyPress={!disabled ? () => setShowPad(!showPad) : () => ""}
              onClick={!disabled ? () => setShowPad(!showPad) : () => ""}
            />
          </span>
        )}
      </div>
      {/* ************** start show pad *************** */}

      <div
        className={cx({ [Classes["time-picker-pad"]]: showSecond, [Classes["time-picker-pad-without-second"]]: !showSecond }, classNamePad)}
        style={{ display: !showPad && "none" }}>
        <div>
          {showSecond && (
            <div>
              <p>{Dictionary.second}</p>
              <div className={Classes["time-picker-day"]}>
                <ul className={Classes["day-ul"]} ref={secondRef}>
                  {range(0, 59).map((second) => (
                    <li
                      id={second}
                      key={second}
                      className={cx(Classes["every-day"], { [Classes["active-time-item"]]: localState.second === second.toString().padStart(2, 0) })}
                      onClick={() => handleLocalState(second, "second")}>
                      {second.toString().padStart(2, 0)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div>
            <p>{Dictionary.minute}</p>
            <div className={Classes["time-picker-month"]}>
              <ul className={Classes["month-ul"]} ref={minuteRef}>
                {range(0, 59).map((minute) => (
                  <li
                    id={minute}
                    key={minute}
                    className={cx(Classes["every-month"], { [Classes["active-time-item"]]: localState.minute === minute.toString().padStart(2, 0) })}
                    onClick={() => handleLocalState(minute, "minute")}>
                    {minute.toString().padStart(2, 0)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p>{Dictionary.hour}</p>
            <div className={Classes["time-picker-year"]}>
              <ul className={Classes["year-ul"]} ref={hourRef}>
                {start === end ? (
                  <li id={end} key={start} className={cx(Classes["every-year"], Classes["active-date-item"])}>
                    {start}
                  </li>
                ) : (
                  <>
                    {range(start || 0, end || 23).map((hour) => (
                      <li
                        id={hour}
                        key={hour}
                        className={cx(Classes["every-year"], { [Classes["active-time-item"]]: localState.hour === hour.toString().padStart(2, 0) })}
                        onClick={() => handleLocalState(hour, "hour")}>
                        {hour.toString().padStart(2, 0)}
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className={Classes["time-picker-buttons"]}>
          <button
            type="button"
            className={Classes["confirm-button"]}
            onClick={handleSubmit}
            disabled={
              (showSecond && localState.second && localState.minute && localState.hour) || (!showSecond && localState.minute && localState.hour)
                ? false
                : true
            }>
            {Dictionary.record}
          </button>
          <button
            type="button"
            className={Classes["cancel-button"]}
            onClick={() => {
              setShowPad(false);
              if (time !== "") {
                if (showSecond) {
                  setLocalState({ hour: time?.slice(0, 2), minute: time?.slice(3, 5), second: time?.slice(6, 8) });
                } else {
                  setLocalState({ hour: time?.slice(0, 2), minute: time?.slice(3, 5) });
                }
              } else {
                if (showSecond) {
                  setLocalState({ hour: "", minute: "", second: "" });
                } else {
                  setLocalState({ hour: "", minute: "" });
                }
              }
            }}>
            {Dictionary.cancel}
          </button>
        </div>
      </div>

      {/* ************** end show pad *************** */}
    </div>
  );
};

export default TimePicker;
