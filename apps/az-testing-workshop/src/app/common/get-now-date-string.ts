const fillString = '0' as const;
const getYear = (now: Date) => `${now.getFullYear()}`;
const getMonth = (now: Date) =>
  (now.getMonth() + 1).toString().padStart(2, fillString);
const getDay = (now: Date) => now.getDate().toString().padStart(2, fillString);

export const getNowDateString = () => {
  const now = new Date();
  return [getYear(now), getMonth(now), getDay(now)].join('-');
};
