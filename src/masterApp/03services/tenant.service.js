const { ApiError } = require("@/@library/ApiError");
const { fillOwnerDataInNewTenant } = require("./tenantFiller");
const { tenantSchema } = require("masterApp/@validators/tenantSchema");
const { adminDb } = require("database");
const TenantRepo = require("masterApp/04repo/tenant.repo");

class TenantService {
    constructor() {
        this.Tenant = adminDb.models.Tenant;
        this.tenantRepo = new TenantRepo();
    }
    // Create a new tenant
    async createTenantService(data) {
        let isDbCreated = false;
        let newTenantInfo = null;
        let newDbInstance;

        console.log("Incoming Tenant Data =>", data);

        try {
            // Validate input using Zod schema
            const result = tenantSchema.safeParse(data);
            if (!result.success) {
                console.log("Validation Error Details:");
                result.error.errors.forEach((err) => {
                    console.log(`Field "${err.path[0]}" has error: ${err.message}`);
                });

                // Throw formatted validation error
                throw new ApiError("Validation failed", 400, result.error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message
                })));
            }

            // Check if a tenant with the same dbName already exists
            const existingTenant = await this.tenantRepo.getTenantByName(data.dbName);
            if (existingTenant) {
                throw new ApiError(`Tenant with dbName "${data.dbName}" already exists`, 409);
            }

            // Prepare tenant metadata to store in the master DB
            const tenantData = {
                owner_name: data.owner_name,
                tenant_name: data.tenant_name,
                dbName: data.dbName,
                subdomain: data.subdomain,
                phone_number: data.phone_number,
                email: data.email,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                full_address: data.full_address,
                status: "active"
            };

            // Create tenant record in master DB
            newTenantInfo = await this.tenantRepo.createTenantRecord(tenantData);
            console.log("Tenant created in master DB =>", newTenantInfo);

            // Create a new database for the tenant
            await this.tenantRepo.createTenantNewDB(tenantData.dbName);
            isDbCreated = true;

            // Add DB instance for tenant and run initial setup
            newDbInstance = await addTenantDB(data.dbName);

            // Fill owner role, permissions, privileges in the new DB
            const res = await fillOwnerDataInNewTenant(data);
            if (!res.success) {
                throw new ApiError("Failed to assign Owner role, privilege, or permission", 500);
            }

            // Everything successful
            const protocol = process.env.USE_HTTPS === 'true' ? 'https' : 'http';
            const tenantPortalURL = `${protocol}://${newTenantInfo.subdomain}.${process.env.SYSTEM_DOMAIN}`
            return {
                id: newTenantInfo.id,
                schoolName: newTenantInfo.tenant_name,
                dbName: newTenantInfo.dbName,
                subdomain: newTenantInfo.subdomain,
                email: newTenantInfo.email,
                tenantPortalURL
            };

        } catch (error) {
            console.log("createTenantService :: error while creating tenant =>", error);

            // Rollback tenant record if inserted
            if (newTenantInfo) {
                await this.tenantRepo.deleteTenantRecord(newTenantInfo?.id);
            }

            // Drop DB if created
            if (isDbCreated) {
                await newDbInstance?.sequelize.close();
                await this.tenantRepo.dropTenantDB(data.dbName);
            }

            throw error;
        }
    }


    // Get tenant details by ID or dbName
    async getTenantDetailsService({ tenantId, dbName, subdomain }) {
        if (!tenantId && !dbName && !subdomain) {
            throw new ApiError('Either tenantId, dbName, or subdomain is required', 400);
        }

        let tenant = null;

        if (tenantId) {
            tenant = await this.tenantRepo.getTenantById(tenantId);
        } else if (dbName) {
            tenant = await this.tenantRepo.getTenantByName(dbName);
        } else if (subdomain) {
            tenant = await this.tenantRepo.getTenantBySubdomain(subdomain);
        }

        if (!tenant) {
            throw new ApiError('Tenant not found', 404);
        }

        return tenant;
    }

    // Update tenant details
    async updateTenantService(tenantId, data) {
        const existingTenant = await this.tenantRepo.getTenantById(tenantId);
        if (!existingTenant) {
            throw new ApiError(`Tenant with ID "${tenantId}" not found`, 404);
        }

        return await this.tenantRepo.updateTenant(tenantId, data);
    }

    // Delete a tenant with proper checks
    async deleteTenantService(tenantId) {
        const tenant = await this.tenantRepo.getTenantById(tenantId);
        if (!tenant) {
            throw new ApiError(`Tenant with ID "${tenantId}" not found`, 404);
        }

        return await this.tenantRepo.deleteTenant(tenantId);
    }

    // Activate tenant
    async activateTenantService(tenantId) {
        const tenant = await this.tenantRepo.getTenantById(tenantId);
        if (!tenant) throw new ApiError(`Tenant with ID "${tenantId}" not found`, 404);

        if (tenant.isActive) throw new ApiError('Tenant is already active', 400);

        return await this.tenantRepo.activateTenant(tenantId);
    }

    // Deactivate tenant
    async deactivateTenantService(tenantId) {
        const tenant = await this.tenantRepo.getTenantById(tenantId);
        if (!tenant) throw new ApiError(`Tenant with ID "${tenantId}" not found`, 404);

        if (!tenant.isActive) throw new ApiError('Tenant is already inactive', 400);

        return await this.tenantRepo.deactivateTenant(tenantId);
    }

    // Get all tenants with pagination support
    async getAllTenantsService({ page = 1, limit = 10 }) {
        const offset = (page - 1) * limit;
        const tenants = await this.tenantRepo.getAllTenants({ limit, offset });

        if (!tenants || tenants.length === 0) {
            throw new ApiError('No tenants found', 404);
        }

        return tenants;
    }
}

module.exports = TenantService;
