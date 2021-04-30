const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function (req, res, next) {
    //Next is the callback that need to be done so that the code goes to the next middleware


    //Get token from the header
    const token = req.header('x-auth-token');

    //Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'no token, authorization denied!' });
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user; // this req.user can be used further in any of our protected routes 
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}