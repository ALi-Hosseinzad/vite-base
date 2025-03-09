export const findStatus = (value) => {
  let result;
  if (value) {
    switch (value) {
      case "REJECT":
        result = "rejected";
        break;
      case "ACCEPT":
        result = "success";
        break;
      case "WAITING":
        result = "pending";
        break;
      case "UNKNOWN":
        result = "pending";
        break;
      case "VERIFY":
        result = "success";
        break;
      default:
        result = "pending";
        break;
    }
  }
  return result;
};
