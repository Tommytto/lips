const Chat = require('../models/chat.model');
const Link = require('../models/link.model');
const Message = require('../models/message.model');
const mongoose = require('mongoose');

exports.createChat = function(req, res, next) {
    const data = {
        name: req.body.name,
        owner: req.user._id,
        members: [req.user._id]
    };

    if (req.body.name && req.user) {
        const newChat = new Chat(data);

        newChat.save(function(err, user) {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.render('index/index', { user : req.user });
    }
};

exports.chatListView = function(req, res, next) {
    if (req.user) {
        Chat.find({members: req.user._id}, (err, result) => {
            res.render('chat/index', { user : req.user, chatList: result });
        });
    } else {
        res.redirect('/');
    }
};

exports.chatView = function(req, res, next) {
    if (req.user) {
        console.log(req.user);
        Chat.find({members: req.user._id}, (err, chatList) => {
            const currentChat = chatList.find((item) => item._id.equals(req.params.chatId));
            Message.find({_id: {$in: currentChat.messages}}, (error, messageList) => {
                console.log(messageList);
                res.render('chat/view', { user : req.user, chatList, currentChat, messageList });

            });
        });
    } else {
        res.redirect('/');
    }
};

exports.joinToChat = function(req, res, next) {
    if (req.user) {
        Link.findOne({_id: req.query.pass}, function(error, link) {
            Chat.update({_id: req.params.chatId}, {
                $push: {
                    members: req.user._id,
                }
            }, function (err, raw) {
                console.log('The raw response from Mongo was ', raw);
                Link.remove({ _id: req.query.pass }, function (err) {
                    console.log("link deleted - " + req.query.pass);
                    res.redirect('/chat/' + req.params.chatId)
                });
            });
        });
    }
};

exports.getJoinLink = function(req, res, next) {
    const newLink = new Link({chatId: req.params.chatId});
    newLink.save(function(err, link) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(link);
        }
    });
};