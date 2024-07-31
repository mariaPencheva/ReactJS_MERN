const jwt = require('jsonwebtoken');
const secret = '5up3r_secr3t_ssecret';

function createToken(userData) {
    const payload = {
        _id: userData._id,
        username: userData.username,
        email: userData.email,
    };

    // console.log('Creating token with secret:', secret);

    const token = jwt.sign(payload, secret, {
        expiresIn: '30d'
    });

    // console.log('Generated token from the server is:', token);
    return token;}

function verifyToken(token) {
    try {
        const data = jwt.verify(token, secret);
        return data;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = { createToken, verifyToken };