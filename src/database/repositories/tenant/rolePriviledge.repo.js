class RolePriviledgeRepository {
    constructor(tenant) {
        this.db = tenant;
        this.RolePriviledge = tenant.models.RolePriviledge;
    }

    // Assign multiple Privileges to a role
    async assignPriviledges(roleId, priviledgeIds, grantedBy, transaction = null) {
        const rolePriviledges = priviledgeIds.map(priviledgeId => ({
            role_id: roleId,
            priviledge_id: priviledgeId,
            granted_by: grantedBy
        }));

        return await this.RolePriviledge.bulkCreate(rolePriviledges, { transaction });
    }

    // Bulk create role-privilege mappings
    async bulkCreateRolePriviledges(rolePriviledges, transaction = null) {
        return await this.RolePriviledge.bulkCreate(rolePriviledges, {
            transaction,
            ignoreDuplicates: true
        });
    }

    // Get privileges assigned to a role
    async getPriviledgeByRole(roleId) {
        return await this.RolePriviledge.findAll({
            where: { role_id: roleId }
        });
    }

    // Remove specific privileges from a role
    async removePriviledge(roleId, priviledgeIds, transaction = null) {
        return await this.RolePriviledge.destroy({
            where: {
                role_id: roleId,
                priviledge_id: priviledgeIds
            },
            transaction
        });
    }

    // Remove all privileges from a role
    async removeAllPriviledges(roleId, transaction = null) {
        return await this.RolePriviledge.destroy({
            where: { role_id: roleId },
            transaction
        });
    }
}

module.exports = RolePriviledgeRepository;
