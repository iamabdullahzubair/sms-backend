const authMiddleware = require("@/@middlewares/authMiddleware");
const express = require("express");
const moduleRouter = express.Router();

moduleRouter.use("/auth", require("./auth/routes"));

moduleRouter.use(authMiddleware);

moduleRouter.use("/students", require("./students/routes"));
moduleRouter.use("/teachers", require("./students/routes"));
moduleRouter.use("/branch", require("./branch/routes"));


module.exports = moduleRouter;
