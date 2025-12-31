const ApiError = require("../../library/ApiError");
const PermissionRepo = require("../repositories/permission.repo");
const RoleRepo = require("../repositories/role.repo");
const RolePermissionRepository = require("../repositories/rolePermission.repo");

class RoleService {
    constructor(req) {
        this.db = req.tenant;
        this.roleRepo = new RoleRepo(req.tenant);
        this.permissionRepo = new PermissionRepo(req.tenant);
        this.rolePermissionRepo = new RolePermissionRepository(req.tenant);
        this.currentUser = req.user;
    }

    async getAllRoleColumnName() {
        return await this.roleRepo.getAllRolesColumnName();
    }

    async getAllRoles() {
        return await this.roleRepo.getAllRoles();
    }

    async createRole(body) {
        const { role, permissions } = body;
        if (!role || !permissions.length) {
            throw new ApiError("Role must have a name and at least one permission", 400);
        }

        const transaction = await this.db.sequelize.transaction();
        try {
            // Create role
            const createdRole = await this.roleRepo.createRole(role, { transaction });

            // Assign permissions
            await this.rolePermissionRepo.assignPermissions(
                createdRole.id,
                permissions,
                this.currentUser.id,
                transaction
            );

            // Commit transaction
            await transaction.commit();

            return { role: createdRole, message: "Role created successfully" };
        } catch (error) {
            await transaction.rollback();
            console.error("Error creating role:", error);
            throw error;
        }
    }

    async createBulkRoles(rolesData) {
        const transaction = await this.db.sequelize.transaction();
        try {
            // Create bulk roles inside a transaction
            const createdRoles = await this.roleRepo.createBulkRole(rolesData, { transaction });

            // Commit transaction if all roles are successfully created
            await transaction.commit();

            return { roles: createdRoles, message: "Bulk roles created successfully" };
        } catch (error) {
            await transaction.rollback();
            console.error("Error creating bulk roles:", error);
            throw error;
        }
    }
}

module.exports = RoleService;
