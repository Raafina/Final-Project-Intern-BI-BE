const router = require('express').Router();
const SAWControllers = require('../controllers/SAW.controllers');

router.post('/calculate', SAWControllers.calculate);

module.exports = router;
