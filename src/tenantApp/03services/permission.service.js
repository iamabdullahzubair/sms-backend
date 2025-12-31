const PermissionRepo = require("../repositories/permission.repo");
const PrivilegeRepo = require("../repositories/privilege.repo");

class PermissionService {
    constructor(tenant) {
        this.db = tenant;
        this.prirvilegeRepo = new PrivilegeRepo(tenant);
        this.permissionRepo = new PermissionRepo(tenant);
    }

    // ✅ Create a Single Permission with Transaction
    async createPermission(data) {
        const transaction = await this.db.sequelize.transaction();
        try {
            const permission = await this.permissionRepo.createPermission(data, { transaction });
            await transaction.commit();
            return permission;
        } catch (error) {
            await transaction.rollback();
            throw new Error("Error creating permission: " + error.message);
        }
    }

    // ✅ Bulk Create Permissions with Transaction
    async createBulkPermissions(dataArray) {
        const transaction = await this.db.sequelize.transaction();
        try {
            const permissions = await this.permissionRepo.createBulkPermissions(dataArray, { transaction });
            await transaction.commit();
            return permissions;
        } catch (error) {
            await transaction.rollback();
            throw new Error("Error creating bulk permissions: " + error.message);
        }
    }

    // ✅ Get Permission by Slug
    async getPermissionBySlug(slug) {
        try {
            return await this.permissionRepo.getPermissionBySlug(slug);
        } catch (error) {
            throw new Error("Error fetching permission by slug: " + error.message);
        }
    }

    // ✅ List All Permissions
    async getAllPermissions() {
        try {
            const privileges = await this.prirvilegeRepo.getAllPriviledges({ raw: true });
            const permissions = await this.permissionRepo.getAllPermissions({ raw: true });

            const data = privileges.map(priv => {
                return {
                    ...priv,
                    permissions: permissions.filter(per => per.privilege_id === priv.id)
                };
            });

            // Find permissions not assigned to any privilege
            const assignedPrivilegeIds = new Set(privileges.map(p => p.id));
            const orphanPermissions = permissions.filter(
                per => !assignedPrivilegeIds.has(per.privilege_id)
            );

            // Add "others" category if there are orphan permissions
            if (orphanPermissions.length > 0) {
                data.push({
                    id: 'others', // Special ID
                    name: 'Unassigned Permissions',
                    slug: 'unassigned',
                    description: 'Permissions not assigned to any privilege',
                    permissions: orphanPermissions,
                    type: 'orphan',
                    createdAt: null,
                    updatedAt: null
                });
            }
            return data
        } catch (error) {
            throw new Error("Error fetching all permissions: " + error.message);
        }
    }
}

module.exports = PermissionService;
