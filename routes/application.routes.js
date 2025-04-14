const router = require("express").Router();
const applicationControllers = require("../controllers/application.controllers");
const { authMiddleware } = require("../middlewares/auth.middleware");

router
  .route("/")
  .get(authMiddleware("admin"), applicationControllers.getApplications)
  .post(applicationControllers.createApplication);

router
  .route("/:id")
  .get(authMiddleware("admin"), applicationControllers.getApplicationById)
  .put(authMiddleware("admin"), applicationControllers.updateAppliaction)
  .delete(authMiddleware("admin"), applicationControllers.deleteApplication);

router
  .route("/start-date")
  .post(
    authMiddleware("admin"),
    applicationControllers.getApplicationByStartDate
  );

module.exports = router;
