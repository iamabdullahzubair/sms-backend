const asyncHandler = require("@/@library/asyncHandler");
const ApiResponse = require("@/@library/ApiResponse");
const StudentService = require("../services");

class Controller {
    static createStudent = asyncHandler(async (req, res) => {
        const payload = await new StudentService(req).createStudent()
        res.status(200).json(new ApiResponse(200, payload, "Branch added successfully"));
    });
    static getAllStudent = asyncHandler(async (req, res) => {
        const payload = await new StudentService(req).getAllStudents()
        res.status(200).json(new ApiResponse(200, payload, "Fetched all branches successfully"));
    });
    static getStudent = asyncHandler(async (req, res) => {
        const payload = await new StudentService(req).getStudent()
        res.status(200).json(new ApiResponse(200, payload, "Fetched branch successfully"));
    });
    static enrollStudent = asyncHandler(async (req, res) => {
        const payload = await new StudentService(req).enrollStudent()
        res.status(200).json(new ApiResponse(200, payload, "Fetched branch successfully"));
    });
    static createAdmission = asyncHandler(async (req, res) => {
        const payload = await new StudentService(req).createAdmission()
        res.status(200).json(new ApiResponse(200, payload, "Fetched branch successfully"));
    });
}

module.exports = Controller;
