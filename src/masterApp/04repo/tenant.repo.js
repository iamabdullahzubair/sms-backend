const { adminDb } = require("../../database");

class TenantRepo {
    constructor() {
        this.Tenant = adminDb.models.Tenant;
    }

    // Create a new tenant
    async createTenantRecord(data) {
        try {
            const tenant = await this.Tenant.create(data);
            return tenant;
        } catch (error) {
            console.error("Error creating tenant:", error);
            throw new Error("Failed to create tenant");
        }
    }
    // Create a new tenant
    async deleteTenantRecord(id) {
        try {
            const res = await this.Tenant.destroy({ where: { id }, force: true });
            return res;
        } catch (error) {
            console.error("Error creating tenant:", error);
            throw new Error("Failed to create tenant");
        }
    }
    // Create a new Tenant DB
    async createTenantNewDB(dbName) {
        try {
            const query = `CREATE DATABASE ${dbName}`
            const db = await adminDb.sequelize.query(query)
            return db;
        } catch (error) {
            console.error("Error creating tenant:", error);
            throw new Error("Failed to create tenant database");
        }
    }
    // Create a new Tenant DB
    async dropTenantDB(dbName) {
        try {
            const query = `DROP DATABASE ${dbName}`
            const db = await adminDb.sequelize.query(query)
            console.log('db', db);

            return db;
        } catch (error) {
            console.error("Error creating tenant:", error);
            throw new Error("Failed to create tenant database");
        }
    }

    // Get tenant info by ID
    async getTenantById(tenantId) {
        try {
            const tenant = await this.Tenant.findByPk(tenantId);
            return tenant;
        } catch (error) {
            console.error("Error fetching tenant by ID:", error);
            throw new Error("Failed to fetch tenant");
        }
    }

    // Get tenant info by database name
    async getTenantByName(dbName) {
        try {
            const tenant = await this.Tenant.findOne({ where: { dbName } });
            return tenant;
        } catch (error) {
            console.error("Error fetching tenant by name:", error);
            throw new Error("Failed to fetch tenant");
        }
    }
    // Get tenant info by database name
    async getTenantBySubdomain(subdomain) {
        try {
            const tenant = await this.Tenant.findOne({
                where: { subdomain },
                attributes: ['id', 'tenant_name', 'dbName', 'subdomain'] // limit fields from DB
            });
    
            if (!tenant) return null;
    
            return {
                id: tenant.id,
                schoolName: tenant.tenant_name,
                dbName: tenant.dbName,
                subdomain: tenant.subdomain,
            };
        } catch (error) {
            console.error(`[TenantService] Error in getTenantBySubdomain:`, error);
            throw new Error('Failed to fetch tenant by subdomain');
        }
    }
    

    // Update tenant information
    async updateTenant(tenantId, data) {
        try {
            const [updatedRows] = await this.Tenant.update(data, {
                where: { id: tenantId }
            });
            if (updatedRows === 0) throw new Error("Tenant not found or no updates made");
            return await this.getTenantById(tenantId);
        } catch (error) {
            console.error("Error updating tenant:", error);
            throw new Error("Failed to update tenant");
        }
    }

    // Soft delete a tenant
    async deleteTenant(tenantId) {
        try {
            const deletedTenant = await this.Tenant.destroy({
                where: { id: tenantId }
            });
            if (!deletedTenant) throw new Error("Tenant not found");
            return { success: true, message: "Tenant deleted successfully" };
        } catch (error) {
            console.error("Error deleting tenant:", error);
            throw new Error("Failed to delete tenant");
        }
    }

    // Get all tenants
    async getAllTenants() {
        try {
            const tenants = await this.Tenant.findAll();
            return tenants;
        } catch (error) {
            console.error("Error fetching tenants:", error);
            throw new Error("Failed to fetch tenants");
        }
    }

    // Activate a tenant
    async activateTenant(tenantId) {
        return this.updateTenant(tenantId, { isActive: true });
    }

    // Deactivate a tenant
    async deactivateTenant(tenantId) {
        return this.updateTenant(tenantId, { isActive: false });
    }

    // Check tenant status
    async checkTenantStatus(tenantId) {
        const tenant = await this.getTenantById(tenantId);
        if (!tenant) throw new Error("Tenant not found");
        return tenant.isActive ? "Active" : "Inactive";
    }
}

module.exports = TenantRepo;
