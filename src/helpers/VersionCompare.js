export const VersionCompare = (v1, v2) => {
  const preVersion = v1?.split(".");
  const currentVersion = v2?.split(".");
  if (JSON.stringify(preVersion) === JSON.stringify(currentVersion)) {
    return "equal";
  } else {
    if (Number(preVersion[0]) < Number(currentVersion[0])) {
      return true;
    } else if (Number(preVersion[0]) === Number(currentVersion[0]) && Number(preVersion[1]) < Number(currentVersion[1])) {
      return true;
    } else if (
      Number(preVersion[0]) === Number(currentVersion[0]) &&
      Number(preVersion[1]) === Number(currentVersion[1]) &&
      Number(preVersion[2]) < Number(currentVersion[2])
    ) {
      return true;
    } else {
      return false;
    }
  }
};
