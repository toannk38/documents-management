const format = (date, locale = 'en-GB') => new Date(date).toLocaleDateString(locale);
const parse = (str) => new Date(str);
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
const isBefore = (a, b) => new Date(a) < new Date(b);
const isAfter = (a, b) => new Date(a) > new Date(b);

module.exports = {
  format,
  parse,
  addDays,
  isBefore,
  isAfter,
};
