const router = require('express').Router();
const applicationControllers = require('../controllers/application.controllers');
const { authMiddleware } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(authMiddleware('admin'), applicationControllers.getApplications);

router
  .route('/:id')
  .get(authMiddleware('admin'), applicationControllers.getApplication)
  .put(authMiddleware('admin'), applicationControllers.updateAppliaction)
  .delete(authMiddleware('admin'), applicationControllers.deleteApplication);

module.exports = router;
