const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const error = {
    success: false,
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
    error.status = 400;
  }

  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.status = 400;
  }

  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.status = 404;
  }

  res.status(error.status).json({
    success: false,
    message: error.message
  });
};

module.exports = errorHandler;
