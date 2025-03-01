const router = require('express').Router();

const authControllers = require('../controllers/auth.controllers');
const internRoutes = require('./intern.routes');

router.use('/auth/login', authControllers.login);
router.use('/applications', internRoutes);

module.exports = router;
