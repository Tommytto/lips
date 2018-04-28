const jsonwebtoken = require("jsonwebtoken");
const User = require('./models/user.model');
const Message = require('./models/message.model');
const Chat = require('./models/chat.model');

exports.bindSocket = function(server) {
    const io = require('socket.io')(server);
    io.on('connection', function(socket){
        socket.authorized = false;

        setTimeout(function() {
            if(!socket.authorized) {
                socket.disconnect(true);
            }
        }, 1000); //1 second to authorize or kill the socket

        socket.on('authorize', function(data) {
            jsonwebtoken.verify(data.token, 'RESTFULAPIs', function(err, decode) {
                if (err) {
                    socket.emit('authorize', null);
                } else {
                    User.findOne({
                        email: decode.email
                    }, function(err, user) {
                        socket.emit('authorize', user);

                    });
                }
            })
        });

        socket.on('chat', function({message, token, chatId}) {
            jsonwebtoken.verify(token, 'RESTFULAPIs', function(err, decode) {
                if (err) {
                    socket.emit('authorize', null);
                } else {
                    User.findOne({
                        email: decode.email
                    }, function(err, user) {
                        const newMessage = new Message({text: message, author: user._id});
                        newMessage.save((err, messageModel) => {
                            if (!err) {
                                Chat.update({_id: chatId}, {
                                    $push: {
                                        messages: messageModel._id,
                                    }
                                }, (errorrr) => {
                                    if (!errorrr) {
                                        io.sockets.emit('chat', {
                                            name: user.name,
                                            message: messageModel.text,
                                        });
                                    } else {
                                        console.error(errorrr);

                                    }
                                });
                            } else {
                                console.error(err);
                            }
                        });
                    });
                }
            });
        });
    });
};