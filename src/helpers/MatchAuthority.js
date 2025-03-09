export const MatchAuthority = (list, key) => {
  if (list?.includes(key)) {
    return true;
  } else {
    return false;
  }
};
