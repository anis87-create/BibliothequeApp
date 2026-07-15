const jwt = require('jsonwebtoken');

module.exports.protect = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization?.startsWith('Bearer ')){
        return res.status(401).json({msg:'Authorization header is missing or invali'})
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
         return res.status(401).json({
            msg: "Token is invalid or expired"
        });
    }
}