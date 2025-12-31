const { errorHandler } = require("@/@middlewares/errorHandler")
const { requestLogger } = require("@/@middlewares/requestLogger")

const { masterApiRouter } = require("masterApp/01api")
const moduleRouter = require("tenantApp/_modules")

const mainApp = (app) => {
    app.use(requestLogger)

    app.use("/master/api/v1", masterApiRouter)
    app.use("/tenant/api/v1", moduleRouter)

    app.use(errorHandler)
}

module.exports = mainApp