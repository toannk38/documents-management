const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, '../../temp');
const maxAge = 1000 * 60 * 60 * 24; // 1 day

if (fs.existsSync(tempDir)) {
  const files = fs.readdirSync(tempDir);
  files.forEach(file => {
    const filePath = path.join(tempDir, file);
    const stat = fs.statSync(filePath);
    if (Date.now() - stat.mtimeMs > maxAge) {
      fs.unlinkSync(filePath);
      console.log('Deleted:', filePath);
    }
  });
  console.log('Cleanup complete.');
} else {
  console.log('No temp directory found.');
}
