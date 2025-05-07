const router = require("express").Router();

const authRoute = require("./auth.routes");
const applicationRoute = require("./application.routes");
const weightRoute = require("./weight.routes");
const DSSRoute = require("./DSS.routes");

router.use("/auth", authRoute);
router.use("/applications", applicationRoute);
router.use("/weights", weightRoute);
router.use("/DSS", DSSRoute);

module.exports = router;
