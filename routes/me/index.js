const { sessionService, userService } = require('@services');
const { userValidator, validate } = require('@validators');
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { SESSION_MAX_AGE } = require('@constants');

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.send(req.user);
  })
);

router.post(
  '/refreshPassword',
  validate(userValidator.refreshPassword),
  asyncHandler(async (req, res) => {
    const { oldPassword, password } = req.body;

    const passwordedUser = await userService.changePassword(req.user.username, oldPassword, password);
    const user = await userService.deletePassword(passwordedUser);

    await sessionService.removeSession(req.cookies.session);
    const session = await sessionService.createSession(user);

    res.cookie('session', session, {
      maxAge: SESSION_MAX_AGE,
      httpOnly: true,
      secure: true,
    });

    res.send(user);
  })
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    await sessionService.removeSession(req.cookies.session);

    res.cookie('session', 'logout', {
      maxAge: 1,
      httpOnly: true,
      secure: true,
    });

    res.json({ success: true });
  })
);

module.exports = router;
