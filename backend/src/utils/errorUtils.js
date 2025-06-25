const formatError = (err) => {
  return {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  };
};

const logError = (err) => {
  // You can integrate with logger here
  console.error(err);
};

module.exports = {
  formatError,
  logError,
};
