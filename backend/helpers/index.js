const jwt = require('jsonwebtoken');

module.exports.generateToken = (id, role) => {
    const secret = process.env.JWT_SECRET || process.env.SECRET_TOKEN;

    if (!secret) {
        throw new Error('JWT secret is not configured.');
    }

    return jwt.sign(
        {
            id,
            role
        },
        secret,
        {
            expiresIn: '30d',
            algorithm: 'HS256',
        }
    );
};