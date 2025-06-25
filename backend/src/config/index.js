// Central config export
module.exports = {
  database: require('./database'),
  auth: require('./auth'),
  multer: require('./multer'),
  cors: require('./cors'),
  swagger: require('./swagger'),
  logger: require('./logger'),
  redis: require('./redis'),
  mail: require('./mail'),
  constants: require('./constants'),
  session: require('./session'),
  s3: require('./s3'),
};
