const router = require('express').Router();

const authControllers = require('../controllers/auth.controllers');

router.use('/auth/login', authControllers.login);
router.use('/', (req, res) => {
  res.status(200).json({
    message: 'OK',
  });
});

module.exports = router;
