import Dictionary from "./Dictionary";

export const ConvertNumberToComma = (amount) => {
  if (amount && amount !== "-") {
    return amount.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, "،") + " " + Dictionary.rial;
  } else {
    return "-";
  }
};
