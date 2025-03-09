import React from "react";
import InputComponent from "components/input/InputComponent";
import { ConvertPersianToEnglish } from "helpers/ConvertPersianToEnglish";

const InputNumber = (props) => {
  const { onChange, placeholder } = props;

  const handleChange = (e) => {
    const inputValue = ConvertPersianToEnglish(e.target.value);
    const reg = /^-?\d*(\.\d*)?$/;

    if (reg.test(inputValue) || inputValue === "") {
      onChange();
    }
  };

  return <InputComponent {...props} onChange={handleChange} placeholder={placeholder} />;
};

export default InputNumber;
