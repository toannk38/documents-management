const path = require('path');

const getFileExtension = (filename) => path.extname(filename).slice(1);
const isImage = (filename) => /\.(jpg|jpeg|png|gif)$/i.test(filename);
const isPdf = (filename) => /\.pdf$/i.test(filename);
const getFileSizeMB = (size) => (size / (1024 * 1024)).toFixed(2);

module.exports = {
  getFileExtension,
  isImage,
  isPdf,
  getFileSizeMB,
};
