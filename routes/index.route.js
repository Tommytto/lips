const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller');

router
    .route('/')
    .get(controller.indexView);

module.exports = router;
