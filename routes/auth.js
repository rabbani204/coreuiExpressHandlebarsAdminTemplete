const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

router.get('/login', function(req, res){
	res.render('admin/login', {layout: 'admin-raw'});
});


router.post('/login', function (req, res) {

    // find the user 
    User.findOne({
        name: req.body.username
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token with only our given payload
                // we don't want to pass in the entire user since that has the password
                const payload = {
                    loggedInAt: Date.now()
                };
                var token = jwt.sign(payload, config.secret, {
                    expiresIn: 1440 * 60 // expires in 24 hours
                });

                // return the information including token as JSON
                res.redirect('/home');
            }

        }

    });
});
// app.get('/setup', function (req, res) {

//     // create a sample user
//     var photoblog = new User({
//         name: 'photoblog',
//         password: 'Pb123456'
//     });

//     // save the sample user
//     photoblog.save(function (err) {
//         if (err) throw err;

//         console.log('User saved successfully');
//         res.json({ success: true });
//     });
// });

module.exports = router;