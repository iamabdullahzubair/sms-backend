const { ApiError } = require("@/@library/ApiError");
const ApiResponse = require("@/@library/ApiResponse");
const asyncHandler = require("@/@library/asyncHandler");
const TenantService = require("masterApp/03services/tenant.service");

const tenantService = new TenantService(); // 🔹 Correctly using `new` for the service instance

class TenantController {

    // ➤ Create Tenant
    static createTenant = asyncHandler(async (req, res) => {
        const payload = await tenantService.createTenantService(req.body);
        res.status(201).json(new ApiResponse(201, payload, "Tenant created successfully"));
    });

    // ➤ Get Tenant Details by ID
    static getTenantDetails = asyncHandler(async (req, res) => {
        const { tenantId } = req.params;
        if (!tenantId) {
            throw new ApiError("Tenant ID is required", 400);
        }
        const payload = await tenantService.getTenantDetailsService({ tenantId });
        res.status(200).json(new ApiResponse(200, payload, "Tenant details fetched successfully"));
    });
    // ➤ Get Tenant Details by ID
    static getTenantDetailsBySubdomain = asyncHandler(async (req, res) => {
        const { subdomain } = req.params;
        if (!subdomain) {
            throw new ApiError("subdomain is required", 400);
        }
        const payload = await tenantService.getTenantDetailsService({ subdomain });
        res.status(200).json(new ApiResponse(200, payload, "Tenant details fetched successfully"));
    });

    // ➤ Get Tenant Details by `dbName`
    static getTenantInfoByName = asyncHandler(async (req, res) => {
        const { dbName } = req.params;
        if (!dbName) {
            throw new ApiError("Tenant name is required", 400);
        }
        const payload = await tenantService.getTenantDetailsService({ dbName });
        res.status(200).json(new ApiResponse(200, payload, "Tenant fetched successfully"));
    });

    // ➤ Update Tenant
    static updateTenant = asyncHandler(async (req, res) => {
        const { tenantId } = req.params;
        const payload = await tenantService.updateTenantService(tenantId, req.body);
        res.status(200).json(new ApiResponse(200, payload, "Tenant updated successfully"));
    });

    // ➤ Delete Tenant
    static deleteTenant = asyncHandler(async (req, res) => {
        const { tenantId } = req.params;
        await tenantService.deleteTenantService(tenantId);
        res.status(200).json(new ApiResponse(200, null, "Tenant deleted successfully"));
    });

    // ➤ Activate Tenant
    static activateTenant = asyncHandler(async (req, res) => {
        const { tenantId } = req.params;
        const payload = await tenantService.activateTenantService(tenantId);
        res.status(200).json(new ApiResponse(200, payload, "Tenant activated successfully"));
    });

    // ➤ Deactivate Tenant
    static deactivateTenant = asyncHandler(async (req, res) => {
        const { tenantId } = req.params;
        const payload = await tenantService.deactivateTenantService(tenantId);
        res.status(200).json(new ApiResponse(200, payload, "Tenant deactivated successfully"));
    });

    // ➤ Get All Tenants (with pagination)
    static getAllTenants = asyncHandler(async (req, res) => {
        const { page, limit } = req.query;
        const payload = await tenantService.getAllTenantsService({
            page: Number(page) || 1,
            limit: Number(limit) || 10
        });
        res.status(200).json(new ApiResponse(200, payload, "Tenants fetched successfully"));
    });
}

module.exports = TenantController;
