class PrivilegeRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.Privilege = this.db.models.Privilege;
    }

    // Create a New Privilege
    async createPriviledge(data, options = {}) {
        return await this.Privilege.create(data, { transaction: options.transaction });
    }

    // Bulk Create Privileges
    async createBulkPriviledge(dataArray, options = {}) {
        return await this.Privilege.bulkCreate(dataArray, { transaction: options.transaction });
    }

    // Get Privilege by Slug
    async getPriviledgeBySlug(slug, options = {}) {
        return await this.Privilege.findOne({
            where: { slug },
            transaction: options.transaction
        });
    }

    // List All Privileges
    async getAllPriviledges(options = {}) {
        return await this.Privilege.findAll({
            transaction: options.transaction,
            raw: options.raw,
        });
    }
}

module.exports = PrivilegeRepo;
