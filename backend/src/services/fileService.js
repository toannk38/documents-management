const fs = require('fs');
const path = require('path');

const saveFile = (file, destFolder) => {
  const destPath = path.join(destFolder, file.originalname);
  fs.writeFileSync(destPath, file.buffer);
  return destPath;
};

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  saveFile,
  deleteFile,
};
