import Num2persian from "num2persian";
import Dictionary from "helpers/Dictionary";

export const ConvertToLetters = (amount) => {
  let len = amount.length;

  return (len > 1) & (amount.substr(len - 1, len) > 0)
    ? Num2persian(amount.substr(0, len - 1)) +
        " " +
        Dictionary.toman +
        " " +
        Dictionary.and +
        " " +
        Num2persian(amount.substr(len - 1, len)) +
        " " +
        Dictionary.rial
    : (len > 1) & (amount.substr(len - 1, len) == 0)
    ? Num2persian(amount.substr(0, len - 1)) + " " + Dictionary.toman
    : len > 0
    ? Num2persian(amount.substr(len - 1, len)) + " " + Dictionary.rial
    : "";
};
