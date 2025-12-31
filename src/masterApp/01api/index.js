const { Router } = require("express");
const tenantManagerRouter = require("./tenantManagerApi.js");


const masterApiRouter = Router()

masterApiRouter.use(tenantManagerRouter)

module.exports = { masterApiRouter }