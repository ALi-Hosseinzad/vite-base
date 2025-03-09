import Dictionary from "helpers/Dictionary";

export const HolderItems = [
  { id: "0", value: "ACCOUNT", text: Dictionary.account },
  { id: "1", value: "DEPOSIT", text: Dictionary.deposit },
  { id: "2", value: "TOPIC", text: Dictionary.headline },
];

export const CalculationItems = [
  { id: "10", value: "FIX", text: Dictionary.value + " " + Dictionary.fix },
  { id: "11", value: "PERCENT", text: Dictionary.percentage },
];

export const EventTimeItems = [
  { id: "100", value: "AFTER", text: Dictionary.after },
  { id: "101", value: "BEFORE", text: Dictionary.before },
];
export const InitialState = {
  title: "",
  holder_type: "",
  holder_type_desc: "",
  holder_description: "",
  calculation_type: "",
  calculation_type_desc: "",
  calculation_var: "",
};
