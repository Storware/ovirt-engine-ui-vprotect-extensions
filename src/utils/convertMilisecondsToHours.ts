export const convertMilisecondsToHours = (miliseconds) => {
  let seconds = miliseconds / 1000;
  const hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  const time = (n) => (n < 10 ? `0${n}` : n);
  return `${time(hours)}:${time(minutes)}:${time(seconds)}`;
}
