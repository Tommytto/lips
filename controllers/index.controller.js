const Chat = require('../models/chat.model');

exports.indexView = function(req, res, next) {
    if (req.user) {
        res.redirect('/chat')
    } else {
        res.render('index/index');
    }
};