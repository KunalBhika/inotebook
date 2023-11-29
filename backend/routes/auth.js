const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body , validationResult } = require('express-validator');
const router = express.Router();

const JWT_SECRET = 'KunalBhika1#';

// Validation rules according to which the request will be checked.
const validationRules = [body('name' , `Name can't be empty`).notEmpty().escape(),
body('email' , 'Enter a valid email').isEmail(),
body('password' , 'Password must be atleast 5 characters').isLength({ min: 5 })];

router.post('/createUser', validationRules , async (req, res) => {
    // Before validating the request check if user already exist or not
    let isExisting = await User.findOne({email : req.body.email});

    // if user already exist
    if(isExisting)
        return res.status(400).json({error : "Email already registered!"});

    // (else) if new user validate request
    const errors = validationResult(req);
    // if everything correct create a new user with data received by request and save in DB.
    if(errors.isEmpty()) {
        console.log(req.body);

        // Generating a password hash using bcryptjs
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password , salt);
        req.body.password = secPassword;

        const newUser = User(req.body);

        const data = {
            userId  : {
                id : newUser.id
            }
        }

        const authToken = jwt.sign(data , JWT_SECRET);

        return newUser.save()
        .then(newUser => res.send({authToken})).catch(err => res.status(500).json({error : "some error occured while registering the user!"}));
    }
    // else send validataion error
    res.send({errors : errors.array()});
})

module.exports = router;