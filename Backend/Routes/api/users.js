const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator')
const User = require('../../Models/User')

// @route   POST api/users
// @desc    Register User
// @access  Public


router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    // Registering the users here
    const { name, email, password } = req.body;

    try {
        //See if the user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
        }


        //Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200', //size
            r: 'pg', //pg18+ not allowed
            d: 'mm' //default profile pic
        })


        user = new User({
            name,
            email,
            avatar,
            password

        });

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Return JSON webtoken
        const payload = {
            user: {
                id: user.id,
                // name: user.name // we can also send other params like username etc 
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 }, //this argument is optional
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        )

    } catch (error) {
        console.log(error.message);
        req.status(500).send('server error');
    }



});


module.exports = router;