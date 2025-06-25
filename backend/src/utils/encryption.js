const bcrypt = require('bcrypt');

const hash = async (str) => bcrypt.hash(str, 10);
const verify = async (str, hashVal) => bcrypt.compare(str, hashVal);

module.exports = {
  hash,
  verify,
};
