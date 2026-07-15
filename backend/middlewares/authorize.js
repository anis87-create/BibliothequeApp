const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(404).json({msg:'permission denied!'})
        }
        next();
    }
}