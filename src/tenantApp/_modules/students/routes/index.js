const express = require("express");
const Controller = require("./Controller.js");
const router = express.Router();

router.post("/registration", Controller.createStudent);
router.post("/admission", Controller.createAdmission);
router.post("/enrollment",Controller.enrollStudent);
router.get("/get-all-student",Controller.getAllStudent);
router.get("/get-student/:id",Controller.getStudent);

module.exports = router;
