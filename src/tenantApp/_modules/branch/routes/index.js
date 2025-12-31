const { Router } = require("express");
const Controller = require("./Controller");

const branchRouter = Router()

branchRouter.post('/add-branch', Controller.addBranch)
branchRouter.get('/get-branches-list', Controller.getAllBranches)
branchRouter.get('/get-branch/:id', Controller.getBranch)

module.exports = branchRouter