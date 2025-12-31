const asyncHandler = require("@/@library/asyncHandler");
const ApiResponse = require("@/@library/ApiResponse");
const BranchService = require("../services");

class Controller {
    static addBranch = asyncHandler(async (req, res) => {
        const payload = await new BranchService(req).addBranch()
        res.status(200).json(new ApiResponse(200, payload, "Branch added successfully"));
    });
    static getAllBranches = asyncHandler(async (req, res) => {
        const payload = await new BranchService(req).getAllBranches()
        res.status(200).json(new ApiResponse(200, payload, "Fetched all branches successfully"));
    });
    static getBranch = asyncHandler(async (req, res) => {
        const payload = await new BranchService(req).getBranch()
        res.status(200).json(new ApiResponse(200, payload, "Fetched branch successfully"));
    });
}

module.exports = Controller;
