
const asyncHandler = require("@/@library/asyncHandler");
const ApiResponse = require("@/@library/ApiResponse");
const { ApiError } = require("@/@library/ApiError");
const UserService = require("../services/user.service");

class UserController {

  static getAllUsers = asyncHandler(async (req, res) => {
    const users = await new UserService(req).getAllUsers();
    res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
  });

  static getUserById = asyncHandler(async (req, res) => {
    const user = new UserService(req).getUserById(req.params.id);
    if (!user) throw new ApiError("User not found", 404);
    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
  });

  static createUser = asyncHandler(async (req, res) => {
    const newUser = new UserService(req).createUser(req.body);
    res.status(201).json(new ApiResponse(201, newUser, "User created successfully"));
  });


}

module.exports = UserController;
