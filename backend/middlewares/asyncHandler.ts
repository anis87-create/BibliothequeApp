import type { Request, Response, NextFunction } from 'express';

module.exports.asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(err => {
        next(err);
    });
}