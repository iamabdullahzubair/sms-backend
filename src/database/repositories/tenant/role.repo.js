class RoleRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.Role = this.db.models.Role;
    }

    // Create a New Role
    async createRole(data, options = {}) {
        return await this.Role.create(data, { transaction: options.transaction });
    }

    // Bulk Create Roles
    async createBulkRole(data, options = {}) {
        return await this.Role.bulkCreate(data, { transaction: options.transaction });
    }

    // Get Role by ID
    async getRoleById(roleId, options = {}) {
        return await this.Role.findByPk(roleId, { transaction: options.transaction });
    }

    // Get Roles by IDs
    async getRolesByIds(roleIds, options = {}) {
        return await this.Role.findAll({
            where: { id: roleIds },
            transaction: options.transaction
        });
    }

    // Get Role by Slug
    async getRoleBySlug(slug, options = {}) {
        return await this.Role.findOne({
            where: { slug },
            transaction: options.transaction
        });
    }

    // List All Roles
    async getAllRoles(options = {}) {
        return await this.Role.findAll({ transaction: options.transaction });
    }

    // List All Column Names of Roles Table
    async getAllRolesColumnName(options = {}) {
        const query = `
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = :tableName
        `;

        const results = await this.db.sequelize.query(query, {
            replacements: { tableName: 'roles' },
            type: this.db.sequelize.QueryTypes.SELECT,
            raw: true,
            transaction: options.transaction
        });

        return results.map(col => col.COLUMN_NAME);
    }
}

module.exports = RoleRepo;
