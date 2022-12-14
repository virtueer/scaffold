const { authenticateMiddleware } = require('@middlewares');

const authRoute = require('./auth');
const meRoute = require('./me');

module.exports = app => {
  app.use('/auth', authRoute);
  app.use('/me', authenticateMiddleware, meRoute);
};
