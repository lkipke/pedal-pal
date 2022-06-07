export const convertUtcToReadable = (utc: number) => {
  let date = new Date(0);
  date.setUTCMilliseconds(utc);
  return date.toLocaleTimeString();
};
