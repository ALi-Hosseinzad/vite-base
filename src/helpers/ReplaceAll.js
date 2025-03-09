export function ReplaceAll(string, search, replace) {
  return string?.split(search)?.join(replace);
}
