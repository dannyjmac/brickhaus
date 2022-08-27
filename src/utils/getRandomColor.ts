export const getRandomColor = () => {
  return (
    "hsl(" +
    360 * Math.random() +
    "," +
    (25 + 70 * Math.random()) +
    "%," +
    (50 + 10 * Math.random()) +
    "%)"
  );
};
