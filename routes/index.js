const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', function(req, res, next) {
    User.findOne({}).then(function(data) {
        console.log('data', data);
        res.render('index', {user: data});
    })
    
});

router.post('/', function(req, res, next) {
    const email = req.body.email;
    new User({firstName: 'Mahmood', lastName: 'Humayun', password: 'secret123', email: email}).save(function(err, data){
        if (err) console.log(err);
        else res.redirect('/');
    });
})

module.exports = router;