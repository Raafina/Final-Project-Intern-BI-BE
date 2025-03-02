const router = require('express').Router();

const authControllers = require('../controllers/auth.controllers');
const applicationRoute = require('./application.routes');

router.use('/auth/login', authControllers.login);
router.use('/applications', applicationRoute);

module.exports = router;
