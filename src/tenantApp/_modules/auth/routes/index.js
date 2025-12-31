const { Router } = require("express");
const authMiddleware = require("@/@middlewares/authMiddleware");
const AuthController = require("./Controller");

const authRouter = Router()

authRouter.post("/register-user", AuthController.register)
authRouter.post("/login", AuthController.login)
authRouter.get("/whoAmI", AuthController.whoAmI)
authRouter.post("/refresh", AuthController.refreshToken)
authRouter.post("/logout", authMiddleware, AuthController.logout)

module.exports = authRouter
