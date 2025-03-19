const router = require('express').Router();
const SAWControllers = require('../controllers/SAW.controllers');

router.route('/').post(SAWControllers.calculate);

module.exports = router;
