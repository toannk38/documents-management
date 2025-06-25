const isEmail = (str) => /.+@.+\..+/.test(str);
const isRequired = (val) => val !== undefined && val !== null && val !== '';

module.exports = {
  isEmail,
  isRequired,
};
