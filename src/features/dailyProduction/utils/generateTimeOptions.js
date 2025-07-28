export const generateTimeOptions = (start = 0, end = 23) => {
  const options = [];
  for (let i = start; i <= end; i++) {
    let time = i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`;
    time = time.padStart(5, '0');
    options.push({ value: i, label: time });
  }
  return options;
};