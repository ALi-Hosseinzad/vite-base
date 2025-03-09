import React, { useState } from "react";
import { useEffect } from "react";

const DateFormat = ({ value }) => {
  const [result, setResult] = useState();
  useEffect(() => {
    if (value) {
      if (value.includes("امروز") || value.includes("دیروز")) {
        setResult(value.replace(" ", " - ").slice(0, 5) + value.replace(" ", " - ").slice(8, 16));
      } else {
        setResult(value.replace(" ", " - ").slice(0, -3));
      }
    } else {
      setResult("--");
    }
  }, [value]);
 
  return <span>{result}</span>;
};

export default DateFormat;
