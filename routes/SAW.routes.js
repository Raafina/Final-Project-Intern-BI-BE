const router = require("express").Router();
const SAWControllers = require("../controllers/SAW.controllers");
const { authMiddleware } = require("../middlewares/auth.middleware");
router
  .route("/")
  .post(authMiddleware("admin"), SAWControllers.calculate)
  .get(authMiddleware("admin"), SAWControllers.getSAW_Results);
router
  .route("/send-mail")
  .post(authMiddleware("admin"), SAWControllers.sendMail_Results);

module.exports = router;
