const crypto = require('crypto');
const fs = require('fs');

const jwtSecret = crypto.randomBytes(32).toString('hex');
fs.writeFileSync('jwt.secret', jwtSecret);
console.log('JWT secret generated and saved to jwt.secret');

crypto.generateKeyPair('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
}, (err, publicKey, privateKey) => {
  if (err) throw err;
  fs.writeFileSync('rsa_public.pem', publicKey);
  fs.writeFileSync('rsa_private.pem', privateKey);
  console.log('RSA key pair generated and saved to rsa_public.pem and rsa_private.pem');
});
