class RolePermissionRepository {
    constructor(tenant) {
        this.db = tenant;
        this.RolePermission = tenant.models.RolePermission;
    }

    // Assign multiple permissions to a role
    async assignPermissions(roleId, permissionIds, grantedBy, transaction = null) {
        const rolePermissions = permissionIds.map(permissionId => ({
            role_id: roleId,
            permission_id: permissionId,
            granted_by: grantedBy
        }));

        return await this.RolePermission.bulkCreate(rolePermissions, { transaction });
    }

    // Bulk create role-permission mappings
    async bulkCreateRolePermissions(rolePermissions, transaction = null) {
        return await this.RolePermission.bulkCreate(rolePermissions, {
            transaction,
            ignoreDuplicates: true
        });
    }

    // Get permissions assigned to a role
    async getPermissionsByRole(roleId) {
        return await this.RolePermission.findAll({
            where: { role_id: roleId }
        });
    }

    // Remove specific permissions from a role
    async removePermissions(roleId, permissionIds, transaction = null) {
        return await this.RolePermission.destroy({
            where: {
                role_id: roleId,
                permission_id: permissionIds
            },
            transaction
        });
    }

    // Remove all permissions assigned to a role
    async removeAllPermissions(roleId, transaction = null) {
        return await this.RolePermission.destroy({
            where: { role_id: roleId },
            transaction
        });
    }
}

module.exports = RolePermissionRepository;
