export const getWeekdayDescription = (record) => {
  let result;
  switch (record) {
    case "SATURDAY":
      result = "شنبه";
      break;
    case "MONDAY":
      result = "دوشنبه";
      break;
    case "SUNDAY":
      result = "یکشنبه";
      break;
    case "WEDNESDAY":
      result = "چهارشنبه";
      break;
    case "THURSDAY":
      result = "پنجشنبه";
      break;
    case "TUESDAY":
      result = "سه‌شنبه";
      break;
    case "FRIDAY":
      result = "جمعه";
      break;
    default:
      break;
  }
  return result;
};
