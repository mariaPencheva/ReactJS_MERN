const { verifyToken } = require('../utils/jwtUtils');
const { UnauthorizedError, ForbiddenError } = require('../middleware/errorHandler');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new UnauthorizedError('No token provided'));
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        next(new ForbiddenError('Invalid token'));
    }
};

module.exports = authMiddleware;