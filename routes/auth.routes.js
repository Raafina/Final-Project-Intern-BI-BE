const router = require('express').Router();
const authControllers = require('../controllers/auth.controllers');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/login', authControllers.login);
router.get('/profile', authMiddleware('admin'), authControllers.getUserProfile);
module.exports = router;
