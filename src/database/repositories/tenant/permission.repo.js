class PermissionRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.Permission = this.db.models.Permission;
    }

    // Create a New Permission
    async createPermission(data, options = {}) {
        return await this.Permission.create(data, { transaction: options.transaction });
    }

    // Bulk Create Permissions
    async createBulkPermissions(dataArray, options = {}) {
        return await this.Permission.bulkCreate(dataArray, { transaction: options.transaction });
    }

    // Get Permission by Slug
    async getPermissionBySlug(slug, options = {}) {
        return await this.Permission.findOne({
            where: { slug },
            transaction: options.transaction,
        });
    }

    // List All Permissions
    async getAllPermissions(options = {}) {
        return await this.Permission.findAll({
            transaction: options.transaction,
            raw: options.raw,
        });
    }
}

module.exports = PermissionRepo;
