const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersRoutes = require('./routes/users');
const recommendationRoutes = require('./routes/recommendations');
const authRoutes = require('./routes/auth');

app.use('/users', usersRoutes);
app.use('/recommendations', recommendationRoutes);
app.use('', authRoutes);

/** 404 handler */

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;

  return next(err);
});

/** General error handler */

app.use((err, req, res, next) => {
  if (err.stack) console.error(err.stack);

  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;