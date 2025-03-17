const router = require('express').Router();
const weightController = require('../controllers/weight.controllers');
const { authMiddleware } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(authMiddleware('admin'), weightController.getWeights)
  .post(authMiddleware('admin'), weightController.createWeight);

router
  .route('/:id')
  .get(authMiddleware('admin'), weightController.getWeight)
  .put(authMiddleware('admin'), weightController.updateWeight)
  .delete(authMiddleware('admin'), weightController.deleteWeight);

module.exports = router;
