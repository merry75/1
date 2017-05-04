var express = require('express');
var router = express.Router();
var User = require("../app/model");
var Review = require("../app/reviewModel");
var passport = require('passport');

// ******** WORK IN PROGRESS **********

router.get('/updateProfile', (req, res, next) => {
    return res.send(req.user);
});

router.post('/updateProfile', (req, res, next) => {


    //const errors = req.validationErrors();


    User.findById(req.user._id, (err, user) => {
        console.log(req.user.id)
        if (err) {
            return next(err);
        }

        user.email = req.body.email || '';
        user.username = req.body.username || '';
        user.fullname = req.body.fullname || '';
        // user.profile.username = req.body.username || '';
        // user.profile.location = req.body.location || '';
        // user.profile.phoneNumber = req.body.phoneNumber || '';
        // user.profile.image = req.body.image || '';
        // user.cook = x || '';

        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    // req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
                    return res.redirect('/myAccount');
                }
                return next(err);
            }
            //req.flash('success', { msg: 'Profile information has been updated.' });
            res.redirect('/myAccount');
        });
    });
});

// Add Product

router.post('/addfood', (req, res, next) => {

    var Food = {
        dish: req.body.dish,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        img: req.body.img,
        options: req.body.options,
        availability: {text: req.body.availability}
    };

    //const errors = req.validationErrors();


    User.findById(req.user._id, (err, user) => {
        console.log(req.user.id)
        if (err) {
            return next(err);
        }
        if (req.user.cook) {
            user.foods.push(Food)

            user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        // req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
                        return res.redirect('/home');
                    }
                    return next(err);
                }
                //req.flash('success', { msg: 'Profile information has been updated.' });
                res.redirect('/home');
            });
        }
        else {
            console.log("not a cook");
        }
    });
});
router.post('/addReview', (req, res, next) => {

    let newReview = new Review(req.body);


    const cooksid = req.body.cooksid;
    //const errors = req.validationErrors();

    User.findById(cooksid)
        .then(function (user) {
            newReview.save()
                .then(function (review) {
                    user.reviews.push(review);
                    user.save().then(function (saveduser) {

                        user.populate("reviews", function (err, user) {
                            console.log(user);
                            res.send(user.reviews)

                        })


                    })
                })

        })
        .catch(console.log);
});


module.exports = router;