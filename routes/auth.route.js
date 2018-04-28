const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router
    .route('/register')
    .get(controller.registerView)
    .post(controller.register);

router
    .route('/login')
    .get(controller.loginView)
    .post(controller.login);

router
    .route('/logout')
    .get(controller.loginView)

module.exports = router;
