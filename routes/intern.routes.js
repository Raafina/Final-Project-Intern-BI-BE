const router = require('express').Router();
const applicationsControllers = require('../controllers/application.controllers');

router.route('/').get(applicationsControllers.getApplications);

module.exports = router;
