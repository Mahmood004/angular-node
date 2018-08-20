const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Message = require('../models/message');

router.get('/', function(req, res, next) {
    Message.find({}).populate('user', 'firstName').exec(function(err, messages) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            })
        }
        res.status(200).json({
            message: 'messgaes',
            obj: messages
        });
    });
});

// middlware for user authentication
router.use('/', function(req, res, next) {
    jwt.verify(req.query.token, 'secret', function(err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not authorized',
                error: err
            });
        }
        next();
    });
});

router.post('/', function(req, res, next) {

    const decoded = jwt.decode(req.query.token);

    User.findById(decoded.user._id, function(err, user) {

        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        
        const message = new Message({
            content: req.body.content,
            user: user
        });
    
        message.save(function(err, result){
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            
            user.messages.push(result._id);
            user.save();
            res.status(200).json({
                message: 'message saved',
                obj: result
            });
        });
    });
});

router.patch('/:id', function(req, res, next) {

    const decoded = jwt.decode(req.query.token);

    Message.findById(req.params.id, function(err, message){
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No message found',
                error: {message: 'message not found'}
            });
        }
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Unauthenticated user',
                error: {message: 'User not authorized'}
            });
        }
        message.content = req.body.content;
        message.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(200).json({
                message: 'message updated',
                obj: result
            });
        });
    });
});

router.delete('/:id', function(req, res, next) {

    const decoded = jwt.decode(req.query.token);

    Message.findById(req.params.id, function(err, message){
        if (err) {
            return res.status(500).json({
                title: 'An error occured messageById',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No message found',
                error: {message: 'message not found'}
            });
        }
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Unauthenticated user',
                error: {message: 'User not authorized'}
            });
        }
        Message.remove(message, function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured while removing',
                    error: err
                });
            }
            res.status(200).json({
                message: 'message deleted',
                obj: result
            })
        })
    })
})

module.exports = router;