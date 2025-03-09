import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { DateObject } from "react-multi-date-picker";
import "./GInput.scss";
import "react-multi-date-picker/styles/colors/green.css";

const BirthDayDatePickerComponent = ({ timePickerPlugin, placeholder, ...props }) => {
  const getDateValueHandler = (value) => {
    props?.getDateValue && props?.getDateValue(`${value.year}/${value.month}/${value.day}`);
  };

  return (
    <DatePicker
      className="green"
      onFocusedDateChange={getDateValueHandler}
      calendar={persian}
      placeholder={placeholder}
      locale={persian_fa}
      calendarPosition="top-right"
      maxDate={new DateObject({ calendar: persian })}
      {...props}
    />
  );
};

export default BirthDayDatePickerComponent;
