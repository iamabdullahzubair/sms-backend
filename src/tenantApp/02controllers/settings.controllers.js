
const asyncHandler = require("@/@library/asyncHandler");
const ApiResponse = require("@/@library/ApiResponse");
const AdminSettingService = require("../services/adminSetting.service");

class SettingsController {

    static getAllRoles = asyncHandler(async (req, res) => {
        const payload = await new AdminSettingService(req).getAllRoles();
        res.status(200).json(new ApiResponse(200, payload, "Roles fetched successfully"));
    });

    static getAllPrivilegesAndPermissions = asyncHandler(async (req, res) => {
        const payload = await new AdminSettingService(req.tenant).getAllPermissions();
        res.status(200).json(new ApiResponse(200, payload, "Permissions fetched successfully"));
    });

    static createRoles = asyncHandler(async (req, res) => {
        const payload = await new AdminSettingService(req).createRole(req.body);
        res.status(201).json(new ApiResponse(201, payload, "Role created successfully"));
    });

    static createPrivilegeAndPermissions = asyncHandler(async (req, res) => {
        const payload = await new AdminSettingService(req.tenant).createPrivilegeAndPermissions(req.body);
        res.status(201).json(new ApiResponse(201, payload, "Permission created successfully"));
    });

    static createPermission = asyncHandler(async (req, res) => {
        const payload = await new AdminSettingService(req.tenant).createPermission(req.body);
        res.status(201).json(new ApiResponse(201, payload, "Permission created successfully"));
    });

}

module.exports = SettingsController;
