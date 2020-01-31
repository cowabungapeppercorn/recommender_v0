const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** 404 handler */

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;

  return next(err);
});

/** General error handler */

app.use((err, req, res, next) => {
  if (err.stack) console.log(err.stack);

  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;