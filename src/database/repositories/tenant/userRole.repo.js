class UserRoleRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.UserRole = this.db.models.UserRole;
    }

    // Assign Role to User
    async assignRoleToUser(userId, roleId, transaction = null) {
        return this.UserRole.create(
            {
                user_id: userId,
                role_id: roleId
            },
            { transaction }
        );
    }

    // Assign Role to User with Tracking
    async assignRoleToUserWithTrack(userId, roleId, assignedBy, transaction = null) {
        return this.UserRole.create(
            {
                user_id: userId,
                role_id: roleId,
                assigned_by: assignedBy
            },
            { transaction }
        );
    }

    // Get all roles of a user
    async getUserRoles(userId, transaction = null) {
        return this.UserRole.findAll({
            where: { user_id: userId },
            transaction
        });
    }

    // Remove Role from User
    async removeUserRole(userId, roleId, transaction = null) {
        return this.UserRole.destroy({
            where: {
                user_id: userId,
                role_id: roleId
            },
            transaction
        });
    }
}

module.exports = UserRoleRepo;
