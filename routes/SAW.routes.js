const router = require('express').Router();
const SAWControllers = require('../controllers/SAW.controllers');

router
  .route('/')
  .post(SAWControllers.calculate)
  .get(SAWControllers.getSAW_Results);

module.exports = router;
