const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/', function(req, res, next){
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    });

    user.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err    
            });
        }
        res.status(200).json({
            message: 'User created',
            obj: result
        });
    });
});

router.post('/signin', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user){
        if (err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err    
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid credentials'}    
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid credentials'}    
            });
        }

        jwt.sign({user: user}, 'secret', {expiresIn: 7200}, function(err, token) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err    
                });
            }
            res.status(200).json({
                message: 'Successfully logged in',
                token: token,
                userId: user._id
            });
        });

    })
})

module.exports = router;