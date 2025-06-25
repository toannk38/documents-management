const fs = require('fs');
const path = require('path');

const backupDir = process.argv[2];
const destDir = path.join(__dirname, '../../uploads');

if (!backupDir || !fs.existsSync(backupDir)) {
  console.error('Backup directory not found. Usage: node restore.js <backupDir>');
  process.exit(1);
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(path.join(backupDir, 'uploads'), destDir);
console.log('User files restored from', backupDir);
