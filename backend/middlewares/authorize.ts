import type { Request, Response, NextFunction } from 'express';
import type User = require('../models/User');
declare global {
    namespace Express {
        interface Request {
            user: User.User;
        }
    }
}

const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(404).json({ msg: 'permission denied!' });
        }
        next();
    }
}