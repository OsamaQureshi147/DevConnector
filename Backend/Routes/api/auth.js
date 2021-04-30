const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../Models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public


router.get('/', auth, async (req, res) => {
    //by adding the 'auth' in the above line we make this route protected
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;