const express = require('express');
const router = express.Router();
const controller = require('../controllers/chat.controller');

router
    .route('/')
    .get(controller.chatListView)
    .post(controller.createChat);

router
    .route('/:chatId')
    .get(controller.chatView);

router
    .route('/:chatId/join')
    .get(controller.joinToChat);

router
    .route('/:chatId/link')
    .get(controller.getJoinLink);

module.exports = router;
