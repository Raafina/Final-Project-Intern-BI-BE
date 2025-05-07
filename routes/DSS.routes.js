const router = require("express").Router();
const DSSControllers = require("../controllers/DSS.controllers");
const { authMiddleware } = require("../middlewares/auth.middleware");
router
  .route("/")
  .post(authMiddleware("admin"), DSSControllers.calculate)
  .get(authMiddleware("admin"), DSSControllers.getDSS_Results);
router
  .route("/send-mail")
  .post(authMiddleware("admin"), DSSControllers.sendMail_Results);

module.exports = router;
