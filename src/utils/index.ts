
export const getDay = (): number => {
  var now = new Date().getTime();
  var bDay = new Date(new Date().getFullYear() - 1, 11, 31).getTime()
  // console.log(new Date(new Date().getFullYear() - 1, 11, 31));
  var elapsedT = now - bDay; // in ms
  const msInDay = 1000 * 60 * 60 * 24
  const days = Math.floor(elapsedT / msInDay)
  return days
}
