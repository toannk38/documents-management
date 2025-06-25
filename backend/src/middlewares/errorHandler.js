function errorHandler(err, req, res, next) {
  console.error(err);
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }
  res.status(err.status || 500).json(response);
}

module.exports = { errorHandler };
