const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.register = function(req, res, next) {
    const newUser = new User(req.body);

    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function(err, user) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            user.hash_password = undefined;
            res.redirect('/auth/login');
        }
    });
};

exports.registerView = function(req, res, next) {
    res.render('register/register');
};

exports.loginView = function(req, res, next) {
    res.render('login/login', { user : req.user });
};

exports.login = function(req, res, next) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.status(401).json({ error: 'Authentication failed. User not found.' });
        } else if (user) {
            if (!user.comparePassword(req.body.password)) {
                res.status(401).json({ error: 'Authentication failed. Wrong password.' });
            } else {
                return res.json({token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id}, 'RESTFULAPIs')});
            }
        }
    });
};

exports.logout = function(req, res, next) {
    req.logout();
    res.redirect('/');
};