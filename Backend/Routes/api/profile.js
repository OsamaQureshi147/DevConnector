const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../Models/Profile');
const { check, validationResult } = require('express-validator');
const User = require('../../Models/User');

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Profile


router.get('/me', auth, async (req, res) => {
    try {
        const profile = await (await Profile.findOne({ user: req.user.id }));
        //user in above line is gonna pretain to the user in Models/Profle
        //populate method combines name and avatar with profile
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        profile = profile.populate('user', ['name', 'avatar']);
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error!!');
    }
});

// @route   POST api/profile/
// @desc    Create or update a user profile
// @access  Private
router.post('/', [auth, [
    check('status', 'Status is required')
        .not()
        .isEmpty(),
    check('skills', 'Skills is required')
        .not()
        .isEmpty()
]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            skills,
            status,
            githubusername,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;
        //Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        //Build social object
        profileFields.social = {}

        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;


        try {
            let profile = Profile.findOne({ user: req.user.id });
            if (profile) {
                //Update
                profile = await Profile.findByIdAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.send(profile);
            }
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error!!');
        }
    }
);


module.exports = router;