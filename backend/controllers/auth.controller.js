const authRepository = require('../repositories/auth');
const bcrypt = require('bcrypt');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { generateToken } = require('../helpers');

module.exports.register = asyncHandler(async (req, res, next) => {
    const email = req.body.email?.trim().toLowerCase();
    const fullName = req.body.fullName?.trim();
    const { password } = req.body;
    const errors = {};

    if (!email) {
        errors.email = 'the email is required!';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'the email format is invalid!';
    }

    if (!password) {
        errors.password = 'the password is required!';
    } else if (password.length < 8 || password.length > 72) {
        errors.password = 'the password must be between 8 and 72 characters!';
    }

    if (!fullName) {
        errors.fullName = 'the fullName is required!';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authRepository.register(email, fullName, hashedPassword);
    const token = generateToken(user.id, );

    return res.status(201).json({
        msg: 'Registered successfully!',
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        },
        token,
    });
});

module.exports.login = asyncHandler(async (req, res, next) => {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    const errors = {};

    if (!email) {
        errors.email = 'the email is required!';
    }

    if (!password) {
        errors.password = 'the password is required!';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    const user = await authRepository.getUserByEmail(email);

    // Toujours comparer, même si l'utilisateur n'existe pas, pour égaliser
    // le temps de réponse et ne pas permettre l'énumération de comptes.
    const isMatched = await bcrypt.compare(
        password,
        user ? user.password : authRepository.DUMMY_HASH
    );

    if (!user || !isMatched) {
        return res.status(401).json({ msg: 'invalid credentials' });
    }

    const token = generateToken(user.id);
    return res.status(200).json({
        msg: 'Login successfully!',
        user: {
            id: user.id,
            email: user.email,
        },
        token,
    });
});

module.exports.authMe = asyncHandler(async (req, res, next) => {
    const user = await authRepository.getUserById(req.user.id);
    if(!user){
        return res.status(404).json({msg:'user not found'});
    }
    res.status(200).json(user);
});


