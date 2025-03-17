const router = require('express').Router();

const authControllers = require('../controllers/auth.controllers');
const weight = require('../models/weight');
const applicationRoute = require('./application.routes');
const weightRoute = require('./weight.routes');

router.use('/auth/login', authControllers.login);
router.use('/applications', applicationRoute);
router.use('/weights', weightRoute);
module.exports = router;
