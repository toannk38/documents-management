const fs = require('fs');
const path = require('path');
// For S3 integration, import AWS SDK and configure as needed

const uploadFile = (file, destFolder) => {
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
  uploadFile,
  deleteFile,
};
