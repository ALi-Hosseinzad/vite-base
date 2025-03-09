import React, { useEffect, useRef, useState } from "react";
import Classes from "components/newDatePicker/newDatePicker.module.scss";
import data from "helpers/Dictionary";
import CustomIcon from "components/customIcon/CustomIcon";
import Calendar from "assets/images/icon/Calendar.svg";

const NewDatePicker = (props) => {
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
    startMonth,
    endMonth,
    defaultValue,
  } = props;

  const yearRef = useRef();
  const monthRef = useRef();
  const dayRef = useRef();
  const [localState, setLocalState] = useState({ day: "", month: "", year: "" });
  const [kabise, setKabise] = useState(true);
  const [date, setDate] = useState("");
  const [showPad, setShowPad] = useState(false);

  const range = (start, end) => {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  };

  useEffect(() => {
    setLocalState({ day: "", month: "", year: "" });
    setShowPad(false);
    setDate("");
  }, [resetElement]);

  useEffect(() => {
    if (start === end) {
      setLocalState({ ...localState, year: start });
    }
  }, []);

  useEffect(() => {
    if (value) {
      setDate(value);
      const newValue = value?.split("/");
      setLocalState({ day: newValue[2], month: newValue[1], year: newValue[0] });
    }
  }, []);

  useEffect(() => {
    if (defaultValue) {
      setDate(defaultValue);
      const newValue = defaultValue.split("/");
      setLocalState({ day: newValue[2], month: newValue[1], year: newValue[0] });
    }
  }, [defaultValue]);
  useEffect(() => {
    const topYear = Math.floor((localState.year - start || 1300) / 2);
    const topMonth = Math.floor((localState.month - 1) / 2);
    const topDay = Math.floor((localState.day - 1) / 2);
    if (localState.year === "") {
      yearRef.current.scrollTop = scroll;
    }
    if (localState.year !== "") {
      yearRef.current.scrollTo({
        top: topYear <= 10 ? topYear * 28 : topYear > 10 && topYear <= 20 ? topYear * 29 : topYear * 29.5,
        behavior: "smooth",
      });
      monthRef.current.scrollTo({ top: topMonth * 20, behavior: "smooth" });
      dayRef.current.scrollTo({ top: topDay <= 8 ? topDay * 25 : topDay * 27, behavior: "smooth" });
    }
  }, [showPad]);

  useEffect(() => {
    setShowPad(show);
  }, [show]);

  useEffect(() => {
    if (
      localState.year % 33 === 1 ||
      localState.year % 33 === 5 ||
      localState.year % 33 === 9 ||
      localState.year % 33 === 13 ||
      localState.year % 33 === 17 ||
      localState.year % 33 === 22 ||
      localState.year % 33 === 26 ||
      localState.year % 33 === 30
    ) {
      setKabise(false);
    } else {
      setKabise(true);
    }
  }, [localState]);

  const handleLocalState = (value, param) => {
    if (param !== "year") {
      if (kabise && localState.month === "12" && Number(localState.day) > 29) {
        setLocalState({ ...localState, month: value.toString().padStart(2, 0), day: "29" });
      } else if (param === "month" && value > 6 && localState.day > 30) {
        setLocalState({ ...localState, month: value.toString().padStart(2, 0), day: "30" });
      } else {
        setLocalState({ ...localState, [param]: value.toString().padStart(2, 0) });
      }
    } else {
      setLocalState({ ...localState, [param]: value.toString() });
    }
  };

  const handleSubmit = () => {
    setShowPad(false);
    onChange(localState);
    if (kabise && localState.month === "12" && Number(localState.day) > 29) {
      setDate(localState.year + "/" + localState.month + "/" + 29);
    } else if (localState.month > 6 && localState.day > 30) {
      setDate(localState.year + "/" + localState.month + "/" + 30);
    } else {
      setDate(localState.year + "/" + localState.month + "/" + localState.day);
    }
  };

  return (
    <div className={`${Classes["date-picker-container"]} ${className}`}>
      <span>{label}</span>
      <div className={Classes["text-box-container"]}>
        <input
          id={id}
          name={id}
          value={date}
          readOnly
          className={`${Classes["date-picker-input"]} ${showPad && showActive ? Classes["active"] : ""}`}
          onClick={() => setShowPad(!showPad)}
          placeholder={placeholder || data.placeholderDatePicker}></input>
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

      <div className={`${Classes["date-picker-pad"]} ${classNamePad}`} style={{ display: !showPad && "none" }}>
        <div>
          <div>
            <p>{data.day}</p>
            <div className={Classes["date-picker-day"]}>
              <ul className={Classes["day-ul"]} ref={dayRef}>
                {range(1, kabise && localState?.month === "12" ? 29 : localState?.month > 6 ? 30 : 31).map((day) => (
                  <li
                    id={day}
                    key={day}
                    className={`${Classes["every-day"]} ${localState.day === day.toString().padStart(2, 0) && Classes["active-date-item"]}`}
                    onClick={() => handleLocalState(day, "day")}>
                    {day.toString().padStart(2, 0)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p>{data.month}</p>
            <div className={Classes["date-picker-month"]}>
              <ul className={Classes["month-ul"]} ref={monthRef}>
                {range(Number(startMonth) || 1, Number(endMonth) || 12).map((month) => (
                  <li
                    id={month}
                    key={month}
                    className={`${Classes["every-month"]} ${localState.month === month.toString().padStart(2, 0) && Classes["active-date-item"]}`}
                    onClick={() => handleLocalState(month, "month")}>
                    {month.toString().padStart(2, 0)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p>{data.year}</p>
            <div className={Classes["date-picker-year"]}>
              <ul className={Classes["year-ul"]} ref={yearRef}>
                {start === end ? (
                  <li id={end} key={start} className={`${Classes["every-year"]} ${Classes["active-date-item"]}`}>
                    {start}
                  </li>
                ) : (
                  <>
                    {range(start, end).map((year) => (
                      <li
                        id={year}
                        key={year}
                        className={`${Classes["every-year"]} ${localState.year === year.toString() && Classes["active-date-item"]}`}
                        onClick={() => handleLocalState(year, "year")}>
                        {year}
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className={Classes["date-picker-bottuns"]}>
          <button
            type="button"
            className={Classes["confirm-button"]}
            onClick={handleSubmit}
            disabled={localState.day && localState.month && localState.year ? false : true}>
            {data.record}
          </button>
          <button
            type="button"
            className={Classes["cancel-button"]}
            onClick={() => {
              setShowPad(false);
              if (date !== "") {
                setLocalState({ year: date?.slice(0, 4), month: date?.slice(5, 7), day: date?.slice(8, 10) });
              } else {
                setLocalState({ year: "", month: "", day: "" });
              }
            }}>
            {data.cancel}
          </button>
        </div>
      </div>

      {/* ************** end show pad *************** */}
    </div>
  );
};

export default NewDatePicker;
