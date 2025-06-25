const pick = (obj, keys) => keys.reduce((acc, key) => { if (obj[key] !== undefined) acc[key] = obj[key]; return acc; }, {});
const omit = (obj, keys) => Object.keys(obj).reduce((acc, key) => { if (!keys.includes(key)) acc[key] = obj[key]; return acc; }, {});
const randomString = (len = 8) => Math.random().toString(36).slice(2, 2 + len);

module.exports = {
  pick,
  omit,
  randomString,
};
