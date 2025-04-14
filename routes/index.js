const router = require("express").Router();

const authRoute = require("./auth.routes");
const applicationRoute = require("./application.routes");
const weightRoute = require("./weight.routes");
const SAWroutes = require("./SAW.routes");

router.use("/auth", authRoute);
router.use("/applications", applicationRoute);
router.use("/weights", weightRoute);
router.use("/SAW", SAWroutes);

module.exports = router;
