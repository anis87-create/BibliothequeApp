import type { Request, Response, NextFunction } from 'express';

const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(404).json({ msg: 'permission denied!' });
        }
        next();
    }
}