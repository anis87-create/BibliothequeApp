
const jwt = require('jsonwebtoken');
import type { Request, Response, NextFunction } from 'express';
import type User = require("../models/User");

declare global {
    namespace Express {
        interface Request {
            user: User.User
        }
    }
}

module.exports.protect = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if(!authorization?.startsWith('Bearer ')){
        return res.status(401).json({msg:'Authorization header is missing or invalid'})
    }
    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
         return res.status(401).json({
            msg: "Token is invalid or expired"
        });
    }
}