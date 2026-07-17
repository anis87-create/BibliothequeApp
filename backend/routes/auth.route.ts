const router = require('express').Router();
const authController =  require('../controllers/auth.controller');
const { protect } = require('../middlewares/protect');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.authMe);

module.exports = router;